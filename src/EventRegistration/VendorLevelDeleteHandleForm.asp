<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Delete an Listing</title>
<link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include file="GlobalVariables.asp"--> 
<%  
VendorLevelID = request.querystring("VendorLevelID")
EventID = request.querystring("EventID")
VendorStallPrice = request.querystring("VendorStallPrice")
VendorStallName = request.querystring("VendorStallName")


Query =  "Delete * From VendorLevels where VendorLevelID = " & VendorLevelID & ";" 
Conn.Execute(Query) 
	
	
	Query =  "Delete * From ExtraOptions where ExtraOptionsName= '" & VendorStallName & "' and ExtraOptionsPrice= " & VendorStallPrice & " and  EventID = " & EventID & ";" 
response.Write("query=" & query)
Conn.Execute(Query) 


set Conn = Nothing

response.redirect("VendorsHome.asp?EventID=" & EventID )
%>

</Body>
</HTML>