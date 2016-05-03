<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class CurrentLocationTest extends TestCase
{
    public function test()
    {
        $returnJSON = file_get_contents('http://localhost:8000/');
        $returnObject = json_decode($returnJSON);
        $this->assertEmpty(!$returnObject->country);
    }
}
