<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
<!--#Include virtual="GlobalVariables.asp"-->
 <title>Delete a Class</title>
<link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include file="Header.asp"-->
<!--#Include file="ClassesHeader.asp"-->
<%  
ClassInfoID = request.querystring("ClassInfoID")
EventID = request.querystring("EventID") 
ReturnPage = request.querystring("ReturnPage")

%>


<br>
<table border = "0" bordercolor = "#DBF5F3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "700" align = "center" >
<tr>
 <td class = "body2" colspan  "2"><big><b>Delete Class</b></big><br>
</td>
 </tr>
 <tr><td class = "body2" colspan  "3" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr><td class = "body2" colspan  "3" height = "1"><b>Are You sure that you want to delete the following class?</b></td></tr>
</table>


<% 
	
  	'response.write("ClassInfoID = " & ClassInfoID & "<br>")
  	sql = "select * from Classinfo where ClassInfoID = " & ClassInfoID & "" 
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

<a name="Edit">
<% 
	row = "odd"
	rowcount = 1
 	sql = "select * from ClassInfo  where ClassInfoID = " & ClassInfoID
	'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   

%>


<% 	
	rowcount = 1

		ClassInfoTitle = rs("ClassInfoTitle")
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
		 %>
			
		<table border = "0" bordercolor = "#DBF5F3"  cellpadding=0 cellspacing=0 width = "700" align = "center" >
 
		<tr >
  			<td class = "body2" valign = "top" >
  			<table>
  			<tr>
  				<td class = "body2"  align = "right" valign = "top">Class Title:</td>
  				<td class= "body2">
  					<%=ClassInfoTitle%>
  	
  				</td>
   			</tr>
   		<tr>
  			<td class = "body2" align = "right" valign = "top">Instructor: </td>
  			<td>  
<%=InstructorFirstName %>&nbsp; <%=InstructorLastName %>
</td>
   </tr>
    <tr>
  	<td class = "body2" align = "right" >Price:</td>
  	<td class = "body"> $<%=ClassInfoStudentFee%>
</td>
  	</tr>
  	<tr>
		<td class = "body2" align = "right">
			Date:</td>
		<td class= "body2">
	<%=ClassDateMonth%>/<%=ClassDateDay%>/<%=ClassDateYear%>
		</td>
	   </tr>
<tr>
  	<td class = "body2" align = "right" >Start Time:</td>
  	<td class= "body2"><%=ClassStartTime%></td>
</tr>
<tr>
  	<td class = "body2" align = "right" >End Time:</td>
  	<td class= "body2"><%=ClassEndTime%></td>
</tr>
<tr>
  	<td class = "body2" align = "right" >Room:</td>
  	<td class= "body2"><%=ClassInfoRoomDesignation%></td>
</tr>

<tr>
  	<td class = "body2" align = "right">Min. # Students:</td>
  	<td class = "body2" ><%=ClassInfoMinimumStudents%>
	</td>
	</tr>

  	 <tr>
  	<td class = "body2" align = "right">Max. # Students:</td>
  	<td class = "body2" ><%=ClassInfoMaximumStudents%>
	</td>
	</tr>
	</table>
</td>
</tr>
 <tr><td class = "body2" colspan = "3" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
</table>
<br>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "200" align = "center">
<tr>
<td>
<form  name=form method="post" action="ClassesHome.asp?EventID=<%=EventID %>#Edit">
      <input type="Submit" value="Cancel" class = "regsubmit2">
</form>

</td>
<td align = "left">
<form  name=form method="post" action="ClassesDeletehandleForm.asp?ClassInfoID=<%=ClassInfoID%>&ClassInfoTitle=<%=ClassInfoTitle%>&ClassInfoStudentFee=<%=ClassInfoStudentFee%>&EventID=<%=EventID%>&ReturnPage=<%=ReturnPage %>">

		<input type="Submit" value="Delete" class = "regsubmit2">

	</form>


</td>
</tr>
</table>






<% 'response.redirect("ClassesDeleteHandleForm0.asp?ClassInfoID=" & ClassInfoID & "&EventID=" & EventID )
%>

</Body>
</HTML>