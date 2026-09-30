<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<%@ Language=VBScript %>

<HTML>
<HEAD>
<title>User Administration</title>
<link rel="stylesheet" type="text/css" href="style.css">
<!--#Include virtual="globalVariables.asp"--> 
</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include file="Header.asp"-->
<!--#Include virtual="UsersHeader.asp"-->
<table border = "0" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "980" align = "center">
 <tr>
		<td colspan = "9" align = "center">

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900" align = "center">
	<tr>
		<td Class = "body" >
			<h2>&nbsp;&nbsp;Edit Users</h2>
		</td>
	</tr>
		<tr>
		<td bgcolor = "#abacab" height = "1" ><img src = "images/px.gif"></td>
	</tr>
</table>


<%
 sql = "select * from Event, People where event.PeopleID = People.PeopleID and EventID= " & EventID & " order by PeopleLastName"

response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	rowcount = 1
	dim EventPeopleID(800)
	dim PeopleLastName(800)
	dim PeopleFirstName(800)
	dim PeopleEmail(800)
	dim ActiveMember(800)
	dim AccessLevel(800)



Recordcount = rs.RecordCount +1
%>

<table border = "0" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900" align = "center">
 <tr>
		<td colspan = "5" align = "center" >
					<H2>Edit an Existing Entry</H2>
		</td>
	</tr>
	<tr >
		<th width = "170" align = "center" class = "body"><b>Last Name</b></th>
		<th width = "170" align = "center" class = "body"><b>First Name</b></th>
		<th width = "100" align = "center" class = "body"><b>Email Adress</b></th>
		<th width = "100" align = "center" class = "body"><b>Action</b></th>
	</tr>


	
<%
order = "odd"	

 While  Not rs.eof         
	 EventPeopleID(rowcount) =   rs("PeopleID")
	 PeopleFirstName(rowcount) =   rs("PeopleFirstName")
	 PeopleLastName(rowcount) =   rs("PeopleLastName")
	 PeopleEmail(rowcount) =   rs("PeopleEmail")

	%>

	<form action= 'AdminMembershandleform.asp' method = "post">

<% 
	 if order = "even" then
	  	order = "odd" %>
	  	<tr bgcolor = "#D4D4D4">
	  	
	 <% else
	     order = "even" %>
	 	<tr bgcolor = "white">    
	<% end if %>



		 <td class = "body">
			<input  name="PeopleLastName(<%=rowcount%>)" value= "<%=PeopleLastname(rowcount)%>" size = "30" class = "body">
		</td>
		<td class = "body">
			<input  name="PeopleFirstName(<%=rowcount%>)" value= "<%=PeopleFirstname(rowcount)%>" size = "20" class = "body">
		</td>
		<td class = "body">
			<input  name="PeopleEmail(<%=rowcount%>)" value= "<%=PeopleEmail(rowcount)%>" size = "30" class = "body">
		
		  <input  type = "hidden" name="EventPeopleID(<%=rowcount%>)" value= "<%=  EventPeopleID(rowcount)%>" >

		 </td>
	  	<td class = "body" align = "right"><a href = "AdminResetpassword.asp?EventPeopleID=<%=EventPeopleID(rowcount)%>" class = "small">Reset Password</a></td>

	</tr>

<%
		rowcount = rowcount + 1
	   rs.movenext
	Wend
TotalCount=rowcount 
	
%>
</table>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900" >
<tr>
		<td  valign = "middle">
			<div align = "center">
			<Input type = Hidden name='TotalCount' value = <%=TotalCount%> >
			<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" Class = "RegSubmit2" >
			</form>
		</td>

</tr>
</table>

<!--#Include file="Footer.asp"--> 

</Body>
</HTML>