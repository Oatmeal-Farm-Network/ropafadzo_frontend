<%@ Language="VBScript" %> 
	

<html>
<head>
<!--#Include virtual="GlobalVariables.asp"-->
<title>Edit Classes</title>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="Andresen Events">
<link rel="stylesheet" type="text/css" href="Style.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<% PeopleIDNeeded = True %>
<!--#Include file="Header.asp"-->
<!--#Include file="ClassesHeader.asp"-->
 <% PageTitleText =  "Edit Instructors" %>
<!--#Include file="970Top.asp"-->

<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
	<tr><td class = "Menu2" colspan  "3" height = "1">
		
		 <% sql = "select * from People, Address where People.AddressID = Address.AddressID and  People.instructor = True "
	    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if  rs.eof then %>
		Currently you do not have any instructors listed. To add instructors please select  <a href = "ClassesAddInstructors.asp?EventID=<%=EventID%>" class = "menu2">Add Instructors</a>. 
		
	<% else %>	
		
		Below are a list of the instructors that your have scheduled for your event:
		
		
	<% end if %>
		</td></tr>
</table>
<% Dim name(2000) 
rowcount = rowcount
%>

<%
row = "odd"
rowcount = 1
row = "even"


 sql = "select * from People, Address where People.AddressID = Address.AddressID and  People.instructor = True "
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
	<br>
	<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
	  <tr bgcolor = "#DBF5F3">
	  <td class="Menu2" align = "center" width= "100">
	      
	     </td>
	     <td class="Menu2" align = "center" width = "150">
	       <b>First Name</b>
	     </td>
	     <td class="Menu2" align = "center" width = "150">
	       <b>Last Name</b>
	     </td>
 		<td class="Menu2" align = "center" width = "150">
	       <b>EMail</b>
	     </td>
	     <td class="Menu2" align = "center" width = "150">
	       <b>Phone Number</b>
	     </td>

	     <td class="Menu2" align = "center">
	       <b>Actions</b>
	     </td>

	   </tr>
	<tr><td class = "Menu2" colspan= "6" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	
	<% end if
	order = "odd"
if Not rs.eof  then
	While Not rs.eof  
	PeopleBio = rs("PeopleBio")
	PeopleFirstName = rs("PeopleFirstName")
	PeopleLastName = rs("PeopleLastName")
	Peoplefax = rs("Peoplefax")
	PeopleID = rs("PeopleID")
	Peopleemail = rs("Peopleemail")
	PeopleCell = rs("PeopleCell")
	PeoplePhone = rs("PeoplePhone")
	CellPhone = rs("PeopleCell")
	AddressStreet = rs("AddressStreet")
	AddressApt = rs("AddressApt")
	AddressCity = rs("AddressCity")
	AddressState = rs("AddressState")
	AddressZip = rs("AddressZip")
	AddressCountry = rs("AddressCountry")
	AddressID = rs("AddressID")
    AddressCountry = rs("AddressCountry")
    PeopleImage1 = rs("PeopleImage1")
	%>

	<input type = "hidden" name="EventID" value= "<%= EventID %>" >
	<input type = "hidden" name="PeopleID" value= "<%= PeopleID %>" >
	<% if order = "even" then 
	order = "odd"
		%>
	  <tr bgcolor = "#DBF5F3">
	<% else 
	   order = "even"%>
		<tr>
	<% end if %>
	  <td class="Menu2" align = "center" height = "40">
	      <% if len(PeopleImage1) > 3 then %>
	      	<img src = "<%=PeopleImage1%>" height = "40" >
	      <% end if %>
			
	     </td>
	     <td class="Menu2">
	       <a href = "ClassesEditInstructorsDetails.asp?PeopleID=<%=PeopleID%>&EventID=<%=EventID%>" class="Menu2"><%=PeopleFirstName%></a>
	     </td>
	     <td class="Menu2" >
	       <a href = "ClassesEditInstructorsDetails.asp?PeopleID=<%=PeopleID%>&EventID=<%=EventID%>" class="Menu2"><%=PeopleLastName%></a>
	     </td>
 		<td class="Menu2" >
	      <a href = "ClassesEditInstructorsDetails.asp?PeopleID=<%=PeopleID%>&EventID=<%=EventID%>" class="Menu2"><%=Peopleemail%></a>
	     </td>
	     <td class="Menu2" >
	       <a href = "ClassesEditInstructorsDetails.asp?PeopleID=<%=PeopleID%>&EventID=<%=EventID%>" class="Menu2"><%=PeoplePhone%></a>
	     </td>
     	<td class="Menu2" align = "center">
     		<a href = "ClassesEditInstructorsDetails.asp?PeopleID=<%=PeopleID%>&EventID=<%=EventID%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Instructor"></a>  
	      	<a href = "DeleteInstructorhandle.asp?PeopleID=<%=PeopleID%>&EventID=<%=EventID%>&AddressID=<%=AddressID%>&Delete=Yes"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Instructor"></a>

	     </td>
	</tr>
	<tr><td class = "Menu2" colspan = "6"  height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>
<br>
<% end if %>
<table width = "900" align = "center">
	<tr>
		<td class="Menu2" align = "center"><b><i>Note: To add an Instructor please <a href="ClassesAddInstructors.asp?EventID=<%=eventid%>" class="menu2">click here</a></i></b>
		</td>
	</tr>
</table>
	<!--#Include file="970Bottom.asp"-->
<!--#Include virtual="/Footer.asp"--> 

</Body>
</HTML>