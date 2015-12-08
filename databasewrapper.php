<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include_once("lib/config.inc.php");
include_once 'lib/backend/database.inc.php';

class databasewrapper{
	    
   /**
    * @url    GET insertData
    *
    * @return DomainList
    * @throws 400 No data for given hostname 
    * 
    */
    function insertData($request_data = NULL)
    {
        //$request_data contains array of post/get-data key=>val
        //curl -d "datetime=2015-01-03&key_path=/test&value=3&type=count&unit=" http://localhost/api/genericstatistic/insert?debug=false
        $database = Database::getInstance();
        $database->insertData($request_data);
        return 'OK';
    }
    
    
   /**
    * @url    GET updateTables
    *
    * @return DomainList
    * @throws 400 No data for given hostname 
    * 
    */
    public function updateTables()
    {
        $database = Database::getInstance();
        $database->updateTables();
    }
    
    
   /**
    * @url    GET queryLatest
    *
    * @return DomainList
    * @throws 400 No data for given hostname 
    * 
    */
    public function queryLatest($date){
        $database = Database::getInstance();
        $$database->queryLatest();
    }
    /**
     * @url lastDataset
     * Query the date of the last dataset in the database
     */
    public function lastDataset()
    {
        $database = Database::getInstance();
        
        $result = $database->lastDataset();
        return $result;
    }

    /**
    * @url    GET test
    *
    */
    public function test(){
        return "ok";
    }
    
}