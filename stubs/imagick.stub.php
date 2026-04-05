<?php
// Minimal stub for Intelephense to recognise Imagick class in environments
if (!class_exists('Imagick')) {
    class Imagick {
        public function readImageBlob($blob) {}
        public function setImageFormat($format) {}
        public function setImageCompressionQuality($quality) {}
        public function getImageBlob() { return null; }
    }
}
