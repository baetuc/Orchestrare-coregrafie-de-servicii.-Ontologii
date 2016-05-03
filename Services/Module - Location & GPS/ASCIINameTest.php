<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ASCIINameTest extends TestCase
{
    
    public function test()
    {
        $returnJSON = file_get_contents('http://localhost:8000/?address=Iasi');
        $returnObject = json_decode($returnJSON);
        $this->assertEquals('Iași',$returnObject->city);
        $this->assertEquals('Iasi',$returnObject->city);
    }
}
