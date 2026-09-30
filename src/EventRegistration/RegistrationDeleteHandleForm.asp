<!DOCTYPE html>
<html>
<head>
<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Registry Registration</title>

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">



<%
OrderEventID = request.querystring("OrderEventID")


%>

</HEAD>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >


<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 

<!--#Include file="ReportsHeader.asp"--> 


<a name="Top"></a>
<% PageTitleText = "Delete Registration"  %>
<!--#Include file="970Top.asp"-->
<br>
<table border = "0" width = "960">
<tr>
<td align = "center" valign = "top" class = "body">
<%
OrderEventID = request.querystring("OrderEventID")
EventID = request.Form("EventID")
OrderPeopleID = request.Form("OrderPeopleID")
'response.Write("OrderPeopleID=" & OrderEventID )




 sql = "select * from ordersSetupEvents where  EventID = " & EventID & " and OrderEventID=" & OrderEventID & " and not(Payment_Status='Deleted')"
     
rs.Open sql, conn, 3, 3   
while not rs.eof 
    Query =  " UPDATE OrdersSetupEvents Set Payment_status = 'Deleted'" 
    Query =  Query & " where EventID = " & EventID & " and PeopleID = " & OrderPeopleID & ";" 

    Conn.Execute(Query) 

rs.movenext
wend 
 rs.close
 
 
 sql = "select * from RegistrationTemp where  EventID = " & EventID & " and EventID=" & OrderEventID & " and not(Status='Deleted')"

rs.Open sql, conn, 3, 3   
while not rs.eof 
Query =  " UPDATE Registrationtemp Set Status = 'Deleted'" 
Query =  Query & " where EventID = " & EventID & " and PeopleID = " & OrderPeopleID & ";"

    Conn.Execute(Query) 

rs.movenext
wend 
 rs.close
 
 

 
 sql = "select * from Registration where  EventID = " & EventID & " and EventID=" & OrderEventID & " and not(Status='Deleted')"
     
rs.Open sql, conn, 3, 3   
while not rs.eof 
Query =  " UPDATE Registrationtemp Set Status = 'Deleted'" 
Query =  Query & " where EventID = " & EventID & " and PeopleID = " & OrderPeopleID & ";"

    Conn.Execute(Query) 

rs.movenext
wend 
 rs.close


%>
<b>The Registration has been deleted.</b><br />
<a href = "ReportRegistrationsList.asp" class = "body">Click here</a> top view the list of registrations.
</td>
 </tr>
</table>


<br>
<!--#Include file="970Bottom.asp"-->
 </Body>
</HTML>