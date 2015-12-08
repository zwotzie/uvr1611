<?php
include_once('lib/config.inc.php');
include_once('lib/backend/database.inc.php');

class databasewrapper{
    function __construct(){
        $this->database = Database::getInstance();
    }
    
   /**
    * @url    POST insertData
    *
    */
    function insertData($request_data = NULL)
    {
        //$request_data contains array of post/get-data key=>val
        //curl -d "datetime=2015-01-03&key_path=/test&value=3&type=count&unit=" http://localhost/api/genericstatistic/insert?debug=false
        $this->database->insertData($request_data);
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
        $this->database->updateTables();
    }
    
    
   /**
    * @param int $date {@from path}
    */
    public function queryLatest($date){
        return $this->database->queryLatest($date);
    }
    
    /**
     * @url lastDataset
     * Query the date of the last dataset in the database
     */
    public function lastDataset()
    {
        return $this->database->lastDataset();
    }

   /**
    * @param string $frame {@from path}
    * @url gtCurrentEnergy
    */
    public function gtCurrentEnergy($frame){
        return $this->database->getCurrentEnergy($frame);
    }
    
    /**
    * @url    GET test
    *
    */
    public function test(){
        return "ok";
    }
    
}