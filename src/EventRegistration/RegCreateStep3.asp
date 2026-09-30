<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Create Event</title>
<meta http-equiv="Content-Language" content="en-us">
<link rel="shortcut icon" href="/infinityknot.ico" /> 
<link rel="icon" href="http://www.alpacainfinity.com/infinityknot.ico" /> 
<meta name="author" content="The Andresen Group"/>
<link rel="stylesheet" type="text/css" href="/style.css" />
</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>

<!--#Include file="AdminEventsHeader.asp"-->
<!--#Include file="Header.asp"-->
<%	PeopleIDNeeded = True %>
<!--#Include file="Header.asp"--> 

<%
EventTypeID =request.querystring("EventTypeID")

if len(EventTypeID) < 1 then
  EventTypeID = Session("EventTypeID")
end if

EventID = request.querystring("EventID")
'response.write("EventID=" & EventID)
if len(EventID) < 1 then
  EventID = Session("EventID")
end if

PeopleID = request.querystring("PeopleID")
if len(PeopleID) < 1 then
  PeopleID = Session("PeopleID")

	if len(PeopleID) < 1 then
  	PeopleID= request.form("PeopleID")
	end if
end if

'response.write("Peopleid = " & peopleid )

EventSubTypeID = request.Form("EventSubTypeID")
'response.write("EventSubTypeID = " & EventSubTypeID & "<br/>")
if len(EventSubTypeID) > 0 then

	
'******************************************************************************************
'  FIND THE Services
'******************************************************************************************
dim ServiceTypeIDArray(100)
dim ServiceTypeChecksArray(100)


i= 0
NoServiceTypes = True
sql = "select * from ServiceTypeLookup where EventSubTypeID = " & EventSubTypeID  &  ""
'response.write("ServiceTypelookup sqL = " & sql & "<br>")
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   


while Not rs.eof 
i = i + 1
  ServiceTypeIDArray(i) =  rs("ServiceTypeLookupID")
  
  If Request.Form("ServiceType" & i) = "" Then
   'response.write("I was NOT checked")
   else
    NoServiceTypes = False
    'response.write("I was checked")
End If
  ServiceTypeChecksArray(i) = Request.Form("ServiceTypeLookup1")
  
 'response.write("ServiceTypeIDArray(i) = " & rs("ServiceTypeLookupID") & "<br>")
 'response.write("ServiceTypechecksArray(i)  = " & ServiceTypechecksArray(i) & "<br>")
  
rs.movenext
wend
rs.close

'response.write("NoServiceTypes = " & NoServiceTypes & "<br>")

end if


	
'****************************************************************************************************
'  FIND THE EVENT TYPE
'****************************************************************************************************

sql = "select EventType from EventTypesLookup where EventTypeID = " & EventTypeID  &  ""
'response.write("A type = " & sql & "<br/>")
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

if Not rs.eof then
  EventType = rs("EventType")	
end if
rs.close


if len(EventSubTypeID) > 0 then
 
sql = "select EventSubType from EventSubTypeLookup where  EventSubTypeID = " & EventSubTypeID &  ""
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

if Not rs.eof then
 CurrentEventSubType = rs("EventSubType")
end if 

RS.CLOSE
end if

response.redirect("regCreatestep4.asp")
%>	
	





		<!--#Include file="Footer.asp"-->

	</Body>
</HTML>

