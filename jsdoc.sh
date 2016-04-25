#!/bin/sh -e

rm -rf doc/out
jsdoc -d doc/out js doc/front.md
cp extra/logo.png doc/out

