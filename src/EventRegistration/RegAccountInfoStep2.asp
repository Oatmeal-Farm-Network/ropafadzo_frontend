<html>

<head>

<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Registry Registration</title>

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="BarnStyle.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 
<!--#Include file="RegHeader2.asp"--> 
<%


'rowcount = CInt
rowcount = 1 
RegEventMonth=Request.Form("RegEventMonth") 


 RegEventDay=Request.Form("RegEventDay") 
 RegEventYear=Request.Form("RegEventYear") 
 RegFirstName=Request.Form("RegFirstName") 
 RegLastName=Request.Form("RegLastName") 
 RegStreet=Request.Form("RegStreet") 
 RegCity=Request.Form("RegCity") 
 RegState=Request.Form("RegState") 
 RegZip=Request.Form("RegZip") 
 RegPhone=Request.Form("RegPhone") 
 RegEmail=Request.Form("RegEmail") 
 CoRegFirstName=Request.Form("CoRegFirstName") 
 CoRegLastName=Request.Form("CoRegLastName") 
 CoRegStreet=Request.Form("CoRegStreet") 
 CoRegCity=Request.Form("CoRegCity") 
 CoRegState=Request.Form("CoRegState") 
 CoRegZip=Request.Form("CoRegZip") 
 CoRegPhone=Request.Form("CoRegPhone") 
 CoRegEmail=Request.Form("CoRegEmail") 
 Announcements=Request.Form("Announcements") 
 password=Request.Form("password") 
CoRegUseRegAddress=Request.Form("CoRegUseRegAddress") 
sEvent=Request.Form("sEvent") 

Dim str1
Dim str2
str1 = sEvent
str2 = "'"
If InStr(str1,str2) > 0 Then
	sEvent= Replace(str1,  str2, "''")
	
End If  


str1 = RegFirstName
str2 = "'"
If InStr(str1,str2) > 0 Then
	RegFirstName= Replace(str1,  str2, "''")
	
End If  

str1 = RegLastName
str2 = "'"
If InStr(str1,str2) > 0 Then
	RegLastName= Replace(str1,  str2, "''")
End If  

str1 = RegStreet
str2 = "'"
If InStr(str1,str2) > 0 Then
	RegStreet= Replace(str1,  str2, "''")
End If  

str1 = CoRegFirstName
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoRegFirstName= Replace(str1,  str2, "''")
End If  

str1 = CoRegLastName
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoRegLastName= Replace(str1,  str2, "''")
End If  

str1 = CoRegFirstName
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoRegFirstName= Replace(str1,  str2, "''")
End If  

str1 = CoRegStreet
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoRegStreet= Replace(str1,  str2, "''")
End If  
'response.write(CoRegUseRegAddress)
If CoRegUseRegAddress =  "on" Then
 CoRegStreet=RegStreet
 CoRegCity=RegCity
 CoRegState=RegState
 CoRegZip=RegZip
End if

Query =  " UPDATE Registrants Set Event = '" &  sEvent & "', " 
    Query =  Query + " RegEventMonth = '" &  RegEventMonth & "'," 
	Query =  Query + " RegEventDay = '" &  RegEventDay & "'," 
	Query =  Query + " RegEventYear = '" &  RegEventYear & "'," 
	Query =  Query + " RegFirstName = '" &  RegFirstName & "'," 
	Query =  Query + " RegLastName = '" &  RegLastName & "'," 
	Query =  Query + " RegStreet = '" &  RegStreet & "'," 
	Query =  Query + " RegCity = '" &  RegCity & "'," 
    Query =  Query + " RegState = '" &  RegState & "'," 
    Query =  Query + " RegZip = '" &  RegZip & "',"
    Query =  Query + " RegPhone = '" &  RegPhone & "'," 
    Query =  Query + " RegEmail = '" &  RegEmail & "'," 
	Query =  Query + " CoRegFirstName = '" &  CoRegFirstName & "'," 
	Query =  Query + " CoRegLastName = '" &  CoRegLastName & "'," 
	Query =  Query + " CoRegStreet = '" &  CoRegStreet & "'," 
	Query =  Query + " CoRegCity = '" &  CoRegCity & "'," 
    Query =  Query + " CoRegState = '" &  CoRegState & "'," 
    Query =  Query + " CoRegZip = '" &  CoRegZip & "',"
    Query =  Query + " CoRegPhone = '" &  CoRegPhone & "'," 
    Query =  Query + " CoRegEmail = '" &  CoRegEmail & "'," 
    Query =  Query + " password= '" &  password & "'" 
	 Query =  Query + " where RegcuistID = " & session("EventID") & ";" 
	'response.write(Query)	
	Conn.Execute(Query) 
 
%>
<h1>Your Changes Have Been Made</h1>
<!--#Include virtual="regAccountInclude.asp"-->
		</Body>
</HTML>

