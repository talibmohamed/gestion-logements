<?php
class Database
{
    private $host = 'localhost';
    private $port = '5432';
    private $dbname = 'houselytics';
    private $user;
    private $password;
    private $connection = null;

    public function __construct($role)
    {
        if ($role === 'admin') {
            $this->user = 'admin_user';
            $this->password = 'admin_password';
        } elseif ($role === 'resident') {
            $this->user = 'resident_user';
            $this->password = 'resident_password';
        } else {
            throw new InvalidArgumentException("Invalid role specified.");
        }
    }

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

