<html>
<head>

<!--#Include virtual="GlobalVariables.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Add Classes</title>
<meta name="author" content="AndresenEvents.com">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="AndresenEvents.com">
<link rel="stylesheet" type="text/css" href="Style.css">

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>
 
</head>
<body>

<!--#Include file="Header.asp"-->
<!--#Include file="ClassesHeader.asp"-->


<%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>   
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>




<br>
<table border = "0" bordercolor = "#DBF5F3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900" align = "center" >
<tr>
 <td class = "body2" colspan  "2"><big><b>Edit Classes</b></big><br>
</td>
 </tr>
 <tr><td class = "body2" colspan  "3" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr><td class = "body2" colspan  "3" height = "1">
		<% 
	EventID = request.querystring("EventID")
  	'response.write("EventID = " & EventID & "<br>")
  	sql = "select * from Classinfo where EventID = " & EventID & "" 
	'response.write(sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if rs.eof then 
%>
Currently there are no classes listed. To add classes please <a href ="ClassesAdd.asp?EventID=<%=EventID%>" class = "menu2">click here</a>.<br>
		
<% else %>

Below are a list of the classes that are scheduled for your event:
<% end if %>		
		
		</td></tr>
</table>



<% Message = "" %>
<%Message = request.querystring("Message")%>
<%if len(Message) > 1 then %>
	<table border = "0" bordercolor = "#DBF5F3" cellpadding=0 cellspacing=0 width = "900" align = "center" >
	<tr>
	 <td class = "body2" ><font color = "red"><%=Message%></font>
	 </td>
	 </tr>
	</table>
<% end if %>

<% 
	EventID = request.querystring("EventID")
  	'response.write("EventID = " & EventID & "<br>")
  	sql = "select * from Classinfo where EventID = " & EventID & "" 
	'response.write(sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
		'publish= rs("publish")
		ClassInfoID = rs("ClassInfoID")
		ClassInfoTitle = rs("ClassInfoTitle")
		ClassInfoDescription = rs("ClassInfoDescription")
		ClassHomework= rs("ClassHomework")
		ClassInforoomRequirements= rs("ClassInforoomRequirements")
		ClassInfoMaterialsSupplied= rs("ClassInfoMaterialsSupplied")
		ClassInfoTeacherFee= rs("ClassInfoTeacherFee")
		ClassInfoMaterialFee= rs("ClassInfoMaterialFee")
		ClassInfoStudentFee= rs("ClassInfoStudentFee")
		ClassInfoMaterialFee= rs("ClassInfoMaterialFee")
		ClassInfoOrganizationFee= rs("ClassInfoOrganizationFee")
		ClassInfoMinimumStudents= rs("ClassInfoMinimumStudents")
		ClassInfoRoomDesignation= rs("ClassInfoRoomDesignation")
		ClassInfoAdditionalSession= rs("ClassInfoAdditionalSession")
	
		str1 = ClassInfoTitle
		str2 = "&nbsp;"
		If InStr(str1,str2) > 0 Then
			ClassInfoTitle= Replace(str1,  str2, " ")
		End If 
		
		str1 = ClassInfoTitle
		str2 = "''"
		If InStr(str1,str2) > 0 Then
			ClassInfoTitle= Replace(str1,  str2, "'")
		End If 
	end if 
%>
<SCRIPT LANGUAGE="JavaScript"  type="text/javascript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.AddForm.ClassInfoTitle.value=="") {
themessage = themessage + " - Class Title \r";
}
if (document.AddForm.ClassInfoStudentFee.value=="") {
themessage = themessage + " - Class Price \r";
}


//alert if fields are empty and cancel form submit
if (themessage == "Please fill out the following fields: \r") {
document.AddForm.submit();
}
else {
alert(themessage);
return false;
   }
}
//  End -->
</script>

<a name="Edit">
<% 
	row = "odd"
	rowcount = 1
 	sql = "select * from ClassInfo  where EventID = " & EventID
	'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
%>

	<table border = "0" bordercolor = "#DBF5F3"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
	<form action= 'ClassesEditHandleForm.asp#Edit' method = "post">
	<input name="Action"  size = "60" value = "Update" type = "hidden">
	<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">
<% 	
	rowcount = 1  
	if not rs.eof then %>
	
	<br>
	<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
	  <tr bgcolor = "#DBF5F3">
	  <td class="body2" align = "center" width= "200">
	      <b>Class Title</b>
     </td>
     <td class="body2" align = "center" width = "150">
	       <b>Instructor</b>
	 </td>
	 <td class="body2" align = "center" width = "80">
	       <b>Date</b>
	 </td>
 	 <td class="body2" align = "center" width = "80">
	       <b>Start Time</b>
	 </td>
	 <td class="body2" align = "center" width = "80">
	       <b>End Time</b>
	 </td>
	 <td class="body2" align = "center">
	       <b>Actions</b>
	  </td>
	</tr>
	<tr><td class = "body2" colspan= "6" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>

	
	
   <% end if 
	
	
	While Not rs.eof %>
	
	
	<%	ClassInfoTitle = rs("ClassInfoTitle")
		instructorPeopleID= rs("instructorPeopleID")
		ClassInfoStudentFee = rs("ClassInfoStudentFee")
		ClassDateMonth = rs("ClassDateMonth")
		ClassDateDay = rs("ClassDateDay")
		ClassDateYear = rs("ClassDateYear")
		ClassStartTime = rs("ClassStartTime")
		ClassEndTime = rs("ClassEndTime")
		ClassInfoRoomDesignation = rs("ClassInfoRoomDesignation")
		ClassInfoMaximumStudents = rs("ClassInfoMaximumStudents")
		ClassInfoMinimumStudents = rs("ClassInfoMinimumStudents")
		ClassInfoDescription = rs("ClassInfoDescription")
		ClassHomework = rs("ClassHomework")
		ClassInfoID = rs("ClassInfoID")
		
		sql4 = "select PeopleFirstName, PeopleLastName from People  where PeopleID = " & instructorPeopleID
	'response.write (sql)
    Set rs4 = Server.CreateObject("ADODB.Recordset")
    rs4.Open sql4, conn, 3, 3   
	if not rs4.eof then 
		InstructorFirstName = rs4("PeopleFirstName")
		InstructorLastName = rs4("PeopleLastName")
	end if
	rs4.close
		
		
	%>
		<% if order = "even" then 
	order = "odd"
		%>
	  <tr bgcolor = "#DBF5F3">
	<% else 
	   order = "even"%>
		<tr>
	<% end if %>
	     <td class="body2">
	       <a href = "ClassesEditDetails.asp?ClassInfoID=<%=ClassInfoID%>"><%=ClassInfoTitle %></a>
	     </td>
	     <td class="body2" >
	       <a href = "ClassesEditInstructorsDetails.asp?PeopleID=<%=instructorPeopleID%>"><%=InstructorFirstName%> &nbsp; <%=InstructorLastName%></a>
	     </td>
 		<td class="body2" align = "center">
	      <a href = "ClassesEditDetails.asp?ClassInfoID=<%=ClassInfoID%>">
	      	<% if len(ClassDateMonth) > 1 then %>
	      		  <%=ClassDateMonth%>/
	      	<% end if %>
	      	<% if len(ClassDateDay) > 1 then %>
	      		  <%=ClassDateDay%>/
	      	<% end if %>

			<%=ClassDateYear%></a>
	     </td>
	     <td class="body2" >
	      <a href = "ClassesEditDetails.asp?ClassInfoID=<%=ClassInfoID%>"><%=ClassStartTime%></a>
	     </td>
	         <td class="body2" >
	      <a href = "ClassesEditDetails.asp?ClassInfoID=<%=ClassInfoID%>"><%=ClassEndTime%></a>
	     </td>

     	<td class="body2" align = "center">
	      <a href = "ClassesEditDetails.asp?ClassInfoID=<%=ClassInfoID%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Class"></a>&nbsp;&nbsp;&nbsp; 
	      <a href = "ClassesDeleteHandleForm0.asp?ClassInfoID=<%=ClassInfoID%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Class"></a>&nbsp;&nbsp;&nbsp;
		  <a href = "ClassesEditInstructors.asp?EventID=<%=EventID%>"><img src = "images/instructor.jpg" width = "15" border = "0" alt = "Edit Instructors"></a>
	     </td>
	   </tr>
  
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>

</form>
<% end if %>






<!--#Include virtual="Footer.asp"-->

</Body>
</HTML>