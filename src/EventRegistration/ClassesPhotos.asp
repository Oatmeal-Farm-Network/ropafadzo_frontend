<%@ Language="VBScript" %> 
	

<html>
<head>
<!--#Include virtual="GlobalVariables.asp"-->
<title>Edit Sponsor</title>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="Andresen Events">
<link rel="stylesheet" type="text/css" href="Style.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<% PeopleIDNeeded = True %>
<!--#Include file="Header.asp"-->
<!--#Include file="ClassesHeader.asp"-->

 <% PageTitleText = "Upload Class Photos"  %>
<!--#Include file="970Top.asp"-->
<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
<tr><td class = "body2" colspan  "3"  height = "1">Click on any of the links below to upload class photos.</td></tr>
</table>



<% 
	ClassInfoID = request.querystring("ClassInfoID")
	CurrentClassInfoID = request.querystring("ClassInfoID")
		if len(ClassInfoID) > 0 then
  	sql = "select * from Classinfo where ClassInfoID = " & ClassInfoID & "" 
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
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
end if 
%>


<a name="Edit">
<% 
	row = "odd"
	rowcount = 1
 	sql = "select * from ClassInfo  where EventID = " & EventID 
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
%>

	<table border = "0" bordercolor = "#DBF5F3"  cellpadding=0 cellspacing=0 width = "600" align = "center" >
	<form action= 'ClassesEditHandleForm.asp#Edit' method = "post">
	<input name="Action"  size = "60" value = "Update" type = "hidden">
	<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">
<% 	
	rowcount = 1  
	if not rs.eof then %>
	

	<table border = "0" cellpadding=0 cellspacing=0 width = "600" align = "center">
	  <tr bgcolor = "#DBF5F3">
	  <td class="body2" align = "center" width= "600">
	      <b>Class Title</b>
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
	       <a href = "ClassesPhotos.asp?ClassInfoID=<%=ClassInfoID%>"><%=ClassInfoTitle %></a>
	     </td>
	   </tr>
  
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>

</form>
<% end if %>


<%  


 If Len(CurrentClassInfoID) > 0 Then 
	sql2 = "select * from ClassInfo  where ClassInfoID = " & CurrentClassInfoID
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	if Not rs2.eof  then
		ClassImage1 = rs2("ClassImage1")
	    ClassImage2 = rs2("ClassImage2")
		ClassImage3 = rs2("ClassImage3")
		ClassImage4 = rs2("ClassImage4")
		ClassImage5 = rs2("ClassImage5")
		ClassImage6 = rs2("ClassImage6")
		ClassImage7 = rs2("ClassImage7")
		ClassImage8 = rs2("ClassImage8")		
								
	end if		
	
		rs2.close
		set rs2=nothing
		
%>
 <!-- #include file="ClassesPhotoFormInclude.asp" -->		
<% Else %>
	

 <% End if %>
<br />

<!--#Include file="970Bottom.asp"-->
<br />
  <!-- #include file="Footer.asp" -->
 </Body>
</HTML>
