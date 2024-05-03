<?php

class Database
{
    private $host = 'localhost';
    private $port = '5432';
    private $dbname = 'houselytics';
    private $user = 'postgres';
    private $password = '123456789';
    private $connection = null;

    public function connect()
    {
        $dsn = "pgsql:host={$this->host};port={$this->port};dbname={$this->dbname};user={$this->user};password={$this->password}";
        try {
            $this->connection = new PDO($dsn);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->connection;
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }

    public function disconnect()
    {
        $this->connection = null;
    }

    public function getConnection()
    {
        return $this->connection;
    }
}
