"""Minimal csf package for the Three Doors repo.

This is a vendored snapshot of the Status-Cube store from lantern-os
(src/csf/status_cube.py + the v0.7 lattice primitives it depends on),
taken at lantern-os@8a64b763. The game engine persists player state as a
StatusCube (.csf file); nothing else from the full lantern-os CSF facade
(pack/unpack/compress) is needed here.

Upstream canon lives in alex-place/lantern-os — if the Status-Cube store
changes there, re-vendor these files.
"""
