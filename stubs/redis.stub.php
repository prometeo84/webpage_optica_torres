<?php
// Minimal stub for Intelephense to recognise Redis class in environments
// This file is safe to include in repo; it declares the class only if not present.
if (!class_exists('Redis')) {
    class Redis {
        public function connect(string $host, int $port = 6379) {}
        public function incr(string $key) { return 1; }
        public function expire(string $key, int $seconds) { return true; }
    }
}
