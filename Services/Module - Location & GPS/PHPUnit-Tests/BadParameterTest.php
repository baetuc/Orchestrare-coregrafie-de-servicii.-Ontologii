<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class BadParameterTest extends TestCase
{
     public function test()
    {
        $returnJSON = file_get_contents('http://localhost:8000/?asdasfa=asda');
        $returnObject = json_decode($returnJSON);
        $this->assertEmpty(!$returnObject->country);
    }
}

