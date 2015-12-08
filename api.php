<?php
require_once 'lib/Restler-3.0.0/vendor/restler.php';
use Luracast\Restler\Restler;

$r = new Restler();
//$r->setSupportedFormats('JsonFormat', 'XmlFormat');
$r->addAPIClass('databasewrapper');
$r->handle(); 

