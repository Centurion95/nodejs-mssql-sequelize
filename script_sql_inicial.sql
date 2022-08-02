-- rc95 31/07/2022 01:51

-- DROP DATABASE [db-test];

IF NOT EXISTS (SELECT 1 FROM master.sys.databases WHERE name = 'db-test') CREATE DATABASE [db-test];

-- DROP LOGIN [login-test]; 
-- DROP LOGIN [user-test]; 

-- use [db-test]
-- DROP USER [user-test]; 

use master
CREATE LOGIN [user-test] WITH PASSWORD = 'user-test-password-123456';

use [db-test]
create user [user-test] for login [user-test]

EXEC sp_addrolemember N'db_owner', N'user-test' 
