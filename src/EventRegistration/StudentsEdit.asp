<%@ Language="VBScript" %> 

<html>
<head>
<!--#Include virtual="GlobalVariables.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="Andresen Events">
<link rel="stylesheet" type="text/css" href="Style.css">

<% message=request.querystring("message")%>

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<!--#Include virtual="ClassesHeader.asp"-->
<% PageTitleText = "Edit Students"  %>
<!--#Include file="970Top.asp"-->
<br />
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900" align = "center">
	<tr>
		<td Class = "body">
			<% if len(message) > 1 then %>
				<font color="red"><b><%= message %></b></font> 
			<% end if %>	

		</td>
	</tr>

	 <tr><td class = "body2" colspan  "3"  height = "1">
	 <% sql = "select distinct PeopleID from ClassReg where EventID = " & EventID 
	'response.write("sql=" & sql & "<br>")
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if  rs.eof then %>
	Currently you do not have any students listed. To add students please select  <a href = "StudentsAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Students</a>.
	
	
	<% else %>
	
	Below are listed the students that you have current enrolled in classes, workshops, or seminars:
	
	<% end if 
	rs.close
	%>



</table>
<% Dim name(2000) 
rowcount = rowcount
%>


<form  name="form" action="ClassesAddStudentHandleForm.asp" method = "post">
<input name="Action" Value ="Update"  type = "hidden">
<input type = "hidden" name="EventID" value= "<%= EventID %>" >
<table width = "750" border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=0>

<%
row = "odd"
rowcount = 1
row = "even"
rowcount = 1

	sql = "select distinct PeopleID from ClassReg where EventID = " & EventID 
	'response.write("sql=" & sql & "<br>")
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
	
	<br>
	<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
	  <tr bgcolor = "#DBF5F3">
	  <td class="body2" align = "center" width= "200">
	      <b>First Name</b>
     </td>
	 <td class="body2" align = "center" width = "200">
	       <b>Classes</b>
	 </td>
	 <td class="body2" align = "center" width = "80">
	       <b>Email</b>
	 </td>
 	 <td class="body2" align = "center" width = "80">
	       <b>Phone</b>
	 </td>
	 
	 <td class="body2" align = "center">
	       <b>Actions</b>
	  </td>
	</tr>
	<tr><td class = "body2" colspan= "6" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>

	
	
   <% end if 

 while not rs.eof
    PeopleID = rs("PeopleID")
 	sql2 = "select  People.*, Address.*, classReg.*, classInfo.* from People, ClassInfo, Classreg, Address where Classreg.PeopleID = People.PeopleID and People.AddressID = Address.AddressID and Classreg.ClassInfoID = ClassInfo.ClassInfoID and ClassInfo.EventID = " & EventID & " and classReg.peopleID = " & PeopleID & " order by Classinfo.EventID Desc"

	'response.write("sql2= " & sql2 & "<br>")
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
	
	if Not rs2.eof then 
	PeopleFirstName = rs2("PeopleFirstName")
	PeopleLastName= rs2("PeopleLastName")
	PeopleEmail= rs2("PeopleEmail")
	PeoplePhone= rs2("PeoplePhone")
	PeopleCell= rs2("PeopleCell")
	PeopleFax= rs2("PeopleFax")
	AddressID = rs2("AddressID")
	AddressStreet= rs2("AddressStreet")
	AddressApt= rs2("AddressApt")
	AddressCity= rs2("AddressCity")
	AddressState= rs2("AddressState")
	AddressState= rs2("AddressState")
	AddressZip= rs2("AddressZip")
	ClassPaidAmount = rs2("ClassPaidAmount")
	ClassPaidAmountMonth  = rs2("ClassPaidAmountMonth")
	ClassPaidAmountDay = rs2("ClassPaidAmountDay")
	ClassPaidAmountYear = rs2("ClassPaidAmountYear")
NumberAttending = rs2("NumberAttending")

	
	ClassInfoID = rs2("ClassInfoID")
		ClassRegID = rs2("ClassRegID")

 	end if
 
 
 
 
 %>
 <% if order = "even" then 
	order = "odd"
		%>
	  <tr bgcolor = "#DBF5F3">
	<% else 
	   order = "even"%>
		<tr>
	<% end if %>
	     <td class="body2" valign = "top">
	     <a href = "StudentsEditDetail.asp?PeopleID=<%=PeopleID%>"><%=PeopleFirstName%></a>, 
	     <a href = "StudentsEditDetail.asp?PeopleID=<%=PeopleID%>"><%=PeopleLastName%></a>
	   </td>
		<td class="body2" valign = "top">
<%
i=0

sql3 = "select distinct * from Classinfo where EventID = " & eventID
'response.write(sql3)
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
while not rs3.eof  
i=i + 1

ClassInfoID = rs3("ClassInfoID")


%>	

<% classname = "class(" & rowcount & ")" & i
	'response.write("classname =" & classname & "<br>")
	
	
 sql9 = "select * from ClassReg where ClassInfoID = " & ClassInfoID & " and PeopleID = " & PeopleID
'response.write(sql9)
Set rs9 = Server.CreateObject("ADODB.Recordset")
rs9.Open sql9, conn, 3, 3   
if not rs9.eof then

%>
<%=rs3("ClassInfoTitle") %> &nbsp; (
<%=rs3("ClassDateMonth")%>/<%=rs3("ClassDateDay")%>/<%=rs3("ClassDateYear")%>&nbsp;&nbsp; <%=rs3("ClassStartTime")%> - <%=rs3("ClassEndTime")%> )<br>
<% 
end if 
rs9.close %>


<% rs3.movenext
wend
rs3.close
%>	
</td>


<td class="body2" valign = "top">
	<a href = "StudentsEditDetail.asp?PeopleID=<%=PeopleID%>"><%=PeopleEmail%></a>
	
	</td>
	<td class="body2" valign = "top">
	<a href = "StudentsEditDetail.asp?PeopleID=<%=PeopleID%>"><%=PeoplePhone%></a>
	</td>
	<td class="body2" align = "center" valign = "top">
	      <a href = "StudentsEditDetail.asp?PeopleID=<%=PeopleID%>"><img src = "images/Student.jpg" width = "15" border = "0" alt = "Edit Student"></a>&nbsp;&nbsp;&nbsp; 
	      <a href = "ClassesStudentDelete0.asp?PeopleID=<%=PeopleID%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Student"></a>&nbsp;&nbsp;&nbsp;
	     </td>
	   </tr>
  

<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>
<br>
<!--#Include file="970Bottom.asp"--><br>

	
<!--#Include virtual="/Footer.asp"--> 

</Body>
</HTML>