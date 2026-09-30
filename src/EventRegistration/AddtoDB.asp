<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>Untitled Page</title>
</head>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->
<body>

Add to database
<%
DatabasePath = "../DB/AndresenEvents2.mdb"
ITEM_NUMBER=request.querystring("ITEM_NUMBER")
xDb_Conn_Str = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & server.mappath(DatabasePath) & ";"
Set conn = Server.CreateObject("ADODB.Connection")
conn.Open xDb_Conn_Str
strsql = "SELECT * FROM [OrdersEvents] WHERE EventID = " & EventID
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open strsql, conn, 1, 2
rs.AddNew

rs("ITEM_NUMBER")=ITEM_NUMBER
rs("Payment_status") = Payment_status
rs("EventID") = EventID

rs.Update
rs.Close
Set rs = Nothing
conn.Close
Set conn = Nothing
Response.Clear %>
</body>
</html>
