"""A setuptools based setup module.
See:
https://packaging.python.org/en/latest/distributing.html
https://github.com/pypa/sampleproject
"""

# Always prefer setuptools over distutils
from setuptools import setup, find_packages

# To use a consistent encoding
from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

# Get the long description from the README file
with open(path.join(here, "README.rst"), encoding="utf-8") as f:
    long_description = f.read()

setup(
    name="my-reels",
    use_scm_version=True,
    setup_requires=["setuptools_scm"],
    description="Locally Managed Parts and Project Inventory Tracking",
    long_description=long_description,
    long_description_content_type="text/x-rst",
    # The project's main homepage.
    url="https://github.com/skerr92/my-reels",
    # Author details
    author="Oak Development Technologies",
    author_email="hello@oakdev.tech",
    install_requires=["", ""],
    # Choose your license
    license="GPL-3.0",
    # See https://pypi.python.org/pypi?%3Aaction=list_classifiers
    classifiers=[
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries",
        "Topic :: System :: Hardware",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.4",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
    ],
    # What does your project relate to?
    keywords="odt oakdevtech hardware parts-management inventory-tracker",
    # You can just specify the packages manually here if your project is
    # simple. Or you can use find_packages().
    py_modules=["app.py"],
)
