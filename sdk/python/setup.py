from setuptools import setup, find_packages

setup(
    name="piso-sdk",
    version="1.0.0",
    description="PISO Chain Official Python Developer SDK",
    author="314-hash",
    packages=find_packages(),
    install_requires=[
        "eth-keys>=0.4.0",
        "eth-utils>=2.0.0",
        "pycryptodome>=3.15.0",
    ],
)
