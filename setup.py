#!/usr/bin/env python

from setuptools import setup, find_packages
import sys, os

version = '0.006'

setup(name='heroes lobby',
      version=version,
      packages=find_packages('src',exclude=['lobby.tests*']),
      include_package_data = True, 
      exclude_package_data = { '': ['*tests/*'] },
      install_requires = [
        'setuptools',
        'tornado>=4.2',
        'sqlalchemy>=1.0.5',
        'pymysql>=0.6.6',
        "blueshed-py==0.2",
        'pika>=0.10.0'
      ],
      dependency_links=[
        "git+ssh://git@github.com/blueshed/blueshed-py.git#egg=blueshed",
      ],
      entry_points = {
      'console_scripts' : [
                           'lobby = lobby.web.server:main'
                           ]
      },)