#!/usr/bin/env python3
"""Downloads FragranceNet's product feed from Rakuten over SFTP and unzips it.

Usage:  python3 scripts/refresh-feed.py path/to/feed.xml

Login details come from two GitHub secrets (never stored in this repo):
  RAKUTEN_SFTP_USERNAME   RAKUTEN_SFTP_PASSWORD
"""
import gzip, os, shutil, sys
import paramiko

HOST = 'aftp.linksynergy.com'
PORT = 22
FILE = '216_4752867_mp.xml.gz'          # FragranceNet (merchant 216), full feed
FOLDERS = ['.', '216', 'GLOBAL', 'ADDITIONAL']


def main(dest):
    user = os.environ.get('RAKUTEN_SFTP_USERNAME', '').strip()
    password = os.environ.get('RAKUTEN_SFTP_PASSWORD', '')
    if not user or not password:
        sys.exit('Missing RAKUTEN_SFTP_USERNAME or RAKUTEN_SFTP_PASSWORD secret.')

    transport = paramiko.Transport((HOST, PORT))
    transport.connect(username=user, password=password)
    key = transport.get_remote_server_key()
    print(f'Connected to {HOST} ({key.get_name()} key {key.get_fingerprint().hex()})')
    sftp = paramiko.SFTPClient.from_transport(transport)
    try:
        found = None
        for folder in FOLDERS:
            try:
                names = sftp.listdir(folder)
            except IOError:
                continue
            if FILE in names:
                found = FILE if folder == '.' else f'{folder}/{FILE}'
                break
        if not found:
            sys.exit(f'{FILE} was not found on the server. Check that FragranceNet is still approved.')
        gz_path = dest + '.gz'
        sftp.get(found, gz_path)
        print(f'Downloaded {found} ({os.path.getsize(gz_path):,} bytes)')
    finally:
        sftp.close()
        transport.close()

    with gzip.open(gz_path, 'rb') as src, open(dest, 'wb') as out:
        shutil.copyfileobj(src, out)
    size = os.path.getsize(dest)
    if size < 5_000_000:
        sys.exit(f'The unzipped feed is only {size:,} bytes, which is too small. Stopping.')
    print(f'Unzipped feed: {size:,} bytes')


if __name__ == '__main__':
    main(sys.argv[1])
