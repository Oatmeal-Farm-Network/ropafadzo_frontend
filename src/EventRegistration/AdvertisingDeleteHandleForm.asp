<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Delete an Listing</title>
<link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include file="GlobalVariables.asp"--> 
<%  
AdvertisingID = request.querystring("AdvertisingID")
EventID = request.querystring("EventID")
AdvertisingLevelID = request.querystring("AdvertisingLevelID")
AdvertisingLevelName= request.querystring("AdvertisingLevelName")
AdvertisingLevelPrice= request.querystring("AdvertisingLevelPrice")


Query =  "Delete * From Advertising where AdvertisingID = " & AdvertisingID & ";" 
Conn.Execute(Query) 


Query =  "Delete * From ExtraOptions where ExtraOptionsName= '" & AdvertisingLevelName & "' and ExtraOptionsPrice= '" & AdvertisingLevelPrice & "' and  EventID = " & EventID & ";" 
response.Write("query=" & query)
Conn.Execute(Query) 
	
set Conn = Nothing

response.redirect("AdvertisingHome.asp?EventID=" & EventID )
%>

</Body>
</HTML>