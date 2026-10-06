#!/usr/bin/env python3
"""Downloads FragranceNet's product feed from Rakuten over SFTP and unzips it.

Usage:  python3 scripts/refresh-feed.py path/to/feed.xml

Login details come from two GitHub secrets (never stored in this repo):
  RAKUTEN_SFTP_USERNAME   RAKUTEN_SFTP_PASSWORD

It prints its progress, gives up on a stuck connection after a short wait,
and tries again a few times before stopping.
"""
import gzip, os, shutil, socket, sys, time
import paramiko

HOST = 'aftp.linksynergy.com'
PORT = 22
FILE = '216_4752867_mp.xml.gz'          # FragranceNet (merchant 216), full feed
FOLDERS = ['.', '216', 'GLOBAL', 'ADDITIONAL']
ATTEMPTS = 3
START = time.time()


def log(msg):
    print(f'[{time.time() - START:6.0f}s] {msg}', flush=True)


def connect(user, password):
    log(f'Opening connection to {HOST}')
    sock = socket.create_connection((HOST, PORT), timeout=30)
    transport = paramiko.Transport(sock)
    transport.set_keepalive(15)
    transport.banner_timeout = 30
    transport.connect(username=user, password=password)
    sftp = paramiko.SFTPClient.from_transport(transport)
    sftp.get_channel().settimeout(60)
    log('Logged in')
    return transport, sftp


def find_file(sftp):
    for folder in FOLDERS:
        path = FILE if folder == '.' else f'{folder}/{FILE}'
        try:
            info = sftp.stat(path)
        except IOError:
            continue
        log(f'Found {path} ({info.st_size:,} bytes)')
        return path, info.st_size
    return None, 0


def download(sftp, remote, size, local):
    done = 0
    next_report = 0
    with sftp.open(remote, 'rb') as src, open(local, 'wb') as out:
        src.prefetch(size)
        while True:
            chunk = src.read(1024 * 256)
            if not chunk:
                break
            out.write(chunk)
            done += len(chunk)
            if done >= next_report:
                log(f'Downloaded {done:,} of {size:,} bytes')
                next_report = done + 5_000_000
    if size and done != size:
        raise IOError(f'Only {done:,} of {size:,} bytes arrived')
    log(f'Download finished ({done:,} bytes)')


def main(dest):
    user = os.environ.get('RAKUTEN_SFTP_USERNAME', '').strip()
    password = os.environ.get('RAKUTEN_SFTP_PASSWORD', '')
    if not user or not password:
        sys.exit('Missing RAKUTEN_SFTP_USERNAME or RAKUTEN_SFTP_PASSWORD secret.')

    gz_path = dest + '.gz'
    last_error = None
    for attempt in range(1, ATTEMPTS + 1):
        log(f'Attempt {attempt} of {ATTEMPTS}')
        transport = None
        try:
            transport, sftp = connect(user, password)
            remote, size = find_file(sftp)
            if not remote:
                sys.exit(f'{FILE} was not found on the server. Check that FragranceNet is still approved.')
            download(sftp, remote, size, gz_path)
            last_error = None
            break
        except SystemExit:
            raise
        except Exception as e:
            last_error = e
            log(f'Attempt {attempt} failed: {type(e).__name__}: {e}')
            time.sleep(10)
        finally:
            if transport is not None:
                try:
                    transport.close()
                except Exception:
                    pass
    if last_error is not None:
        sys.exit(f'Could not download the feed after {ATTEMPTS} attempts. Last problem: {last_error}')

    with gzip.open(gz_path, 'rb') as src, open(dest, 'wb') as out:
        shutil.copyfileobj(src, out)
    size = os.path.getsize(dest)
    if size < 5_000_000:
        sys.exit(f'The unzipped feed is only {size:,} bytes, which is too small. Stopping.')
    log(f'Unzipped feed: {size:,} bytes')


if __name__ == '__main__':
    main(sys.argv[1])
