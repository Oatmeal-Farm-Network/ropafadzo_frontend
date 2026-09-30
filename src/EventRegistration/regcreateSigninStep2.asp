<!DOCTYPE html>
<html>
<head>

<%  PageName = "Registry" %>
<!--#Include virtual="GlobalVariables.asp"-->


<title>Registry Login</title>


<link rel="stylesheet" type="text/css" href="Style.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

<table align = "center">
	<tr >
		<td align = "center">
      
<%


Action = request.Querystring("Action")
if len(Action) < 1 then
  Session("Action") = Action
end if 

Rresponse.write("Action=" & Action)



UID=Trim(Request.Form("Email")) 
	password=Trim(Request.Form("password")) 
	group1=Trim(Request.Form("group1")) 
response.write("B group1 and password = " & password & " " & group1 & "<br>")

	sql2 = "select * from People where Email = '" & UID & "' and (Password = '" & password &"' )"
response.write("sql2 =, " & sql2 & "<br>")
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	if Not rs2.eof And Len(UID) > 6 Then	
		regaccessfound = true
		session("RegcustID")= rs2("RegcuistID")
	PeopleID = rs2("PeopleID")
	Session("PeopleID") = PeopleID
	Session("PeopleID")= rs2("PeopleID")
	Session("LoggedIn") = true

	Else
	session("RegcustID")=""
	end if

rs2.close
Set conn = Nothing


%>
	</td>
		</tr>
</table>

<%
	If regaccessfound  = True Or group1 = "NoAccount" Then
		response.write("Redirect") 
		session("TempUID")= UID
			session("TempPassword")= password
			 if session("Action")= "Register" then 
			 	'Response.Redirect("RegSignup.asp?EventID=" & session("EventID"))
			end if 
   			if session("Action")= "List" then 
				'Response.Redirect("regcreate.asp?PeopleID=" & session("PeopleID")
		   end if  
    	   if not(session("Action")= "List") and not(session("Action")= "Register")  then 
    	   	'Response.Redirect("Defualt.asp?PeopleID=" & session("PeopleID")

		
		
	else
%>
		<b>Your username or password was incorrect. Please try again.</b>
			<!--#Include file="RegCreateSigninInclude.asp"-->
	
	
	
<%	End if
%>


<!--#Include file="Footer.asp"-->
</BODY>
</HTML>
