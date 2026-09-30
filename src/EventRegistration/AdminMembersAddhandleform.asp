<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Add Members</title>
       <link rel="stylesheet" type="text/css" href="/administration/style.css">


</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">
<!--#Include file="GlobalVariables.asp"-->
<!--#Include file="Header.asp"-->
<!--#Include virtual="UsersHeader.asp"--> 
<%

	
	CustFirstName=Request.Form("PeopleFirstName") 
	CustLastName=Request.Form("PeopleLastName")
	custPasswd=Request.Form("pw1")
	custPasswd2=Request.Form("pw2")
	CustEmail=Request.Form("email1")
	CustEmail2=Request.Form("email2")
AccessLevel = Request.Form("AccessLevel")


'response.write("CustFirstName=" & CustFirstName)
'response.write("CustLastName=" & CustLastName)
'response.write("CustEmail=" & CustEmail)

Proceed="False"
if len(CustFirstName) < 1 then
  Message= Message & "<br>Please enter a first name."
end if 


if len(CustLastName) < 1 then
  Message=Message & "<br>Please enter a last name."
end if 


if len(CustEmail) < 6 then
  Message=Message & "<br>Please enter a valid email address."
end if 

if CustEmail = CustEmail2  then
else
   Message= Message &  "<br>The <b>email addresses</b> that you entered do not match."
  CustEmail=""
end if

if len(custPasswd) > 6 then
  Proceed = "True"
else
  Proceed="False"
  Message= Message &  "<br>The password that you entered is not long enough."
end if 	

	

if len(custPasswd) < 6 then
  Message=Message & "<br>Please enter a valid password."
end if 


if len(CustEmail) > 6 and Proceed = "True" then
  Proceed = "True"
else
  Proceed="False"
end if 
'response.write("Proceed1=" & Proceed)


if custPasswd = custPasswd2 and Proceed = "True" then
  Proceed = "True"
else
  Proceed="False"
end if 

if CustEmail = CustEmail2 and Proceed = "True" then
  Proceed = "True"
else
  Proceed="False"
end if 

 

response.write("custPasswd=" & custPasswd)
response.write("custPasswd2=" & custPasswd2)

if custPasswd = custPasswd2 then
else
   Message= Message &  "<br>The <b>passwords</b> that you entered do not match."
end if 


response.write("Proceed=" & Proceed)	

if Proceed="True" then

Query =  "INSERT INTO Users (CustFirstName, CustLastName, custPasswd, AccessLevel, CustEmail)" 
	Query =  Query & " Values ('" &  CustFirstName & "', "
    Query =  Query &  " '" & CustLastName & "'," 
    Query =  Query &  " '" & custPasswd & "'," 
    Query =  Query &  " '" & AccessLevel & "'," 
  	Query =  Query &  " '" & CustEmail & "' )" 


response.write(Query)	


Dim DataConnection, cmdDC, RecordSet
Dim RecordToEdit, Updated
Set DataConnection = Server.CreateObject("ADODB.Connection")

DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(DatabasePath) & ";"
DataConnection.Execute(Query) 
DataConnection.close

Set dataConnection = Nothing


 
%>

	
<%	 

End if

if Proceed = "False" then
  Response.redirect("AdminMembersAdd.asp?Message=" & Message & "&PeopleFirstName=" & CustFirstName & "&PeopleLastName=" & CustLastName & "&email=" & CustEmail & "&AccessLevel=" & AccessLevel)
else
  Response.redirect("AdminMembersAdd.asp?Message2=The user was successfully added.")
end if
%>

</Body>
</HTML>
