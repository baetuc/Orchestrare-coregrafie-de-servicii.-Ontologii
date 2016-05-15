<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UnicodeNameTest extends TestCase
{ 
    public function test()
    {
        $returnASCIIJSON = file_get_contents('http://localhost:8000/?address=Iasi');
        $charValue = chr(115);
        $returnUnicodeJSON = file_get_contents('http://localhost:8000/?address=Ia'.$charValue.'i');
        $returnASCIIObject = json_decode($returnASCIIJSON);
        $returnUnicodeObject = json_decode($returnUnicodeJSON);

        $this->assertEquals($returnASCIIObject,$returnUnicodeObject);      
    }
}
