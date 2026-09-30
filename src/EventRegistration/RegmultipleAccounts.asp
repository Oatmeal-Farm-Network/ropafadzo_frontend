
<html>
<head>

<%  PageName = "Registry" %>
<!--#Include virtual="GlobalVariables.asp"-->


<title>Registry Login</title>
<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">

<link rel="stylesheet" type="text/css" href="Style.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

<table align = "center">
	<tr >
		<td align = "center">

      
<%
UID = session("TempUID")
password =	session("TempPassword")

%>

</td>
	</tr>
</table>

<table   border="0" cellspacing="0" cellpadding="0" align = "center"  width = "700" >
	<tr>
	    <td class = "body"  align = "center">
		<h1>Registry Login</H1></td>
	</tr>
<tr>
<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td>
</tr>
<tr>
	<td class = "body" align ="left" >To access one of your registries, please click on the registry number or name below.</td>
</tr>
<tr>
	   <td>
<%	
		sql2 = "select * from People, Event where Event.PeopleID  = People.PeopleID and PeopleEmail = '" & UID & "' and (PeoplePassword = '" & password &"' )"
		'response.write(sql2)
		acounter = 1
		Set rs2 = Server.CreateObject("ADODB.Recordset")
		rs2.Open sql2, conn, 3, 3 
	
	if Not rs2.eof Then %>
		<table border="0" cellspacing="5" cellpadding="5" leftmargin="5" topmargin="5" marginwidth="5" marginheight="5"  align = "center"  valign ="top"  width = "700" >
			<tr bgcolor = "burlywood">
				<td class = "body" width = "100" align = "center">
					Registry #
				</td>
					<td class = "body" width = "100" align = "center">
					Event
				</td>
					<td class = "body" width = "100" align = "center">
					Date
				</td>
			</tr>
	

	<% while Not rs2.eof 	%>
	  
<tr>
				<td class = "body">
					<a href = "RegManageHome.asp?EventID=<%=rs2("EventID") %>" class = "menu"><%=rs2("EventID") %></a>
				</td>
					<td class = "body">
					<a href = "RegManageHome.asp?EventID=<%=rs2("EventID") %>" class = "menu"><%=rs2("EventName")%></a>
				</td>
					<td class = "body">
					<a href = "RegManageHome.asp?EventID=<%=rs2("EventID") %>" class = "menu"><%=rs2("EventStartMonth")%>/<%=rs2("EventStartDay")%>/<%=rs2("EventStartYear")%> - <%=rs2("EventEndMonth")%>/<%=rs2("EventEndDay")%>/<%=rs2("EventEndYear")%></a>
				</td>
			</tr>
		

		<% rs2.movenext
	Wend %>
		</table>

		<% End if
rs2.close
Set conn = Nothing	%>

	  </TD>
	</tr>
</table>
<br><br><br>
<!--#Include file="Footer.asp"-->
</BODY>
</HTML>
