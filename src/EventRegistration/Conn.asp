<%

'**************************************************************
 ' Hard Coded Variables
'**************************************************************
DSN_Name = "MasterDB"


'**************************************************************
 ' Define Conn Object
'**************************************************************
Set Conn = Server.CreateObject("ADODB.Connection") 
Conn.Open "DSN=" & DSN_Name & ";UID=Test;PWD=Test"
Set rs = Server.CreateObject("ADODB.Recordset")
%>