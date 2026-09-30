<%@LANGUAGE="VBSCRIPT" %>
<% Response.Buffer = True %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Login Authentication</title>
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="/Style.css">


<!--#Include virtual="GlobalvariablesNotLoggedIn.asp"-->

      
<%
PeopleID = Request.querystring("PeopleID")

sDate = Now()
sNewDate = DateAdd("yyyy", 2, sDate)

if len(PeopleID)> 0 then

else
    PeopleID = session("PeopleID")
 
end if


Email=Trim(Request.Form("Email")) 
password=Trim(Request.Form("password")) 

Action = Request.querystring("Action") 
ReturnfileName = Request.querystring("ReturnFileName") 
ReturnEventID = Request.querystring("ReturnEventID") 
Response.Cookies("EventID")= ReturnEventID
Response.Cookies("EventID").Expires=now() + 365


if len(Action) < 1 then
  Session("Action") = Action
end if 




	redirect = False


	sql2 = "select * from People where Peopleemail = '" & Email & "' and (PeoplePassword = '" & password & "') order by PeopleID Desc"
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	if Not rs2.eof Then
	PeopleID = rs2("PeopleID")
	Session("PeopleID")= PeopleID

	Response.Cookies("PeopleID")= PeopleID
	Response.Cookies("PeopleID").Expires=now() + 365
	Response.write("cookie PeopleID=" & request.Cookies("PeopleID"))
	Session("LoggedIn") = True
    Response.Cookies("LoggedIn")= True
    Response.Cookies("LoggedIn").Expires=now() + 365
	redirect = true
    end if 
rs2.close
Set conn = Nothing




if len(ReturnFileName) < 5 then
ReturnFileName = "Default.asp"
end if 
'redirect = False
	If redirect = True then
		 if Action= "Register" then 
			  	Response.Redirect(ReturnFileName & "?EventID=" & ReturnEventID & "&PeopleID=" & session("PeopleID"))
			end if 
   			if Action= "List" then 
				Response.Redirect("regcreateType.asp?PeopleID=" & session("PeopleID"))
		   end if  
    	   if Action= "RegHome"  then 
    	  	  Response.Redirect("RegHome.asp?Action=RegHome&PeopleID=" & session("PeopleID"))
           end if
           if not(Action= "List") and not(Action= "Register")  then 
             if ReturnFileName = "Logout.asp" then
            	 Response.Redirect("Default.asp?EventID=" & ReturnEventID & "&PeopleID=" & session("PeopleID"))
             end if 
    	   		Response.Redirect(ReturnFileName & "?EventID=" & ReturnEventID & "&PeopleID=" & session("PeopleID"))
           end if

	End if
%>

</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<% loginpage = True %>


<!--#Include virtual="Header.asp"-->

<table align = "center">
	<tr >
		<td align = "center"><br><br>
			<br><a  class = "body" href="regcreateSignIn.asp?Action=<%=Action%>&ReturnFileName=<%=ReturnFileName%>&ReturnEventID=<%=ReturnEventID%>"> Your username or password was incorrect.<br> Select here to return to the login page and try again.</a>
			<br>
		</td>
	</tr>
</table>
</BODY>
</HTML>
