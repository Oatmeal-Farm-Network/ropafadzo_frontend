<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<%@ Language=VBScript %>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Class Facts</title>
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="The Andresen Group"/>
<link rel="stylesheet" type="text/css" href="/style.css" />
 </head>
 
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Classes" %>
<!--#Include file="OverviewHeader.asp"-->
<!'--#Include file="HeaderTabsIncludeBottom.asp"-->
<!'--#Include file="Scripts.asp"--> 


<!'--#Include File ="Header.asp"--> 
<!'--#Include File ="ClassesHeader.asp"--> 



<% 
ClassInfoID = request.querystring("ClassInfoID")
if len(ClassInfoID) > 0 then
else
ClassInfoID = request.form("ClassInfoID")
end if

if len(ClassInfoID) > 0 then %>

<% PageTitleText = "Edit Class" & ClassName %>
<!--#Include file="970Top.asp"-->


<% Message = "" %>
<%Message = request.querystring("Message")%>
<%if len(Message) > 1 then %>
	<table border = "0" bordercolor = "#DBF5F3" cellpadding=0 cellspacing=0 width = "940" align = "center" >
	<tr>
	 <td class = "body" ><font color = "red"><%=Message%></font>
	 </td>
	 </tr>
	</table>
<% end if %>

<% 
	
  	sql = "select * from Classinfo where ClassInfoID = " & ClassInfoID & "" 
    'response.write("sql=" & sql)

	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
		'publish= rs("publish")
		ClassInfoID = rs("ClassInfoID")
		ClassInfoTitle = rs("ClassInfoTitle")
	InstructorsName= rs("InstructorsName")
	
	InstructorsWebsite= rs("InstructorsWebsite")
	InstructorsBio= rs("InstructorsBio")
		ClassInfoDescription = rs("ClassInfoDescription")
		ClassHomework= rs("ClassHomework")
		ClassInforoomRequirements= rs("ClassInforoomRequirements")
		ClassInfoMaterialsSupplied= rs("ClassInfoMaterialsSupplied")
		ClassInfoTeacherFee= rs("ClassInfoTeacherFee")
		ClassInfoMaterialFee= rs("ClassInfoMaterialFee")
		ClassInfoMaterialFeeOptional= rs("ClassInfoMaterialFeeOptional")
				
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
 	sql = "select * from ClassInfo  where ClassInfoID = " & ClassInfoID
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
%>

	<table border = "0" bordercolor = "#DBF5F3"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
	<tr>
 		<td class = "body" width = "200">* = required field<br>
		</td>
 	</tr>
</table>
	<form action= 'ClassesEditHandleForm.asp#Edit' method = "post">
	<input name="Action"  size = "60" value = "Update" type = "hidden">
	<input name="ClassInfoID"  size = "60" value = "<%=ClassInfoID%>" type = "hidden">
<% 	
	rowcount = 1
	While Not rs.eof 
		ClassInfoTitle = rs("ClassInfoTitle")
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
			
			<table border = "0" width = "940"  cellpadding=0 cellspacing=0 align = "center" bgcolor = "white">
 
		<tr >
  			<td class = "body" valign = "top" >
  			<table border = "0" cellpadding=0 cellspacing=0>
  			<tr>
  				<td class = "body"   valign = "top"><b>Class Title*: </b></td>
  			</tr>
  			<tr>
  				<td>
  					<TEXTAREA NAME="ClassInfoTitle" cols="30" rows="3" wrap="file"  ><%=ClassInfoTitle%></textarea>
  	
  				</td>
   	</tr>
    <tr>
  	<td class = "body"  ><b>Price*:</b></td>
  	</tr>
  	<tr>
  	<td class = "body"> $<input class="positive" type="text" name = "ClassInfoStudentFee" size = 7 maxsize = 9 value = "<%=ClassInfoStudentFee%>">
  	<br><i>For free classes please enter "0" for the price.</i>

	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
  		<tr>
		<td class = "body" >
			<b>Class Materials/Equipment Fee:</b></td>
		</td>
  	 </tr>
  	<tr>
  	<td class = "body">
  	 $<input class="positive" type="text" name = "ClassInfoMaterialFee" size = 7 maxsize = 9 value = "<%=ClassInfoMaterialFee%>">
  	 <script type="text/javascript">
  	     $(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	<b>Optional?</b> 
	<% if ClassInfoMaterialFeeOptional = True then %>
		<small>Yes</small><input TYPE="RADIO" name="ClassInfoMaterialFeeOptional" Value = "1" checked>
		<small>No</small><input TYPE="RADIO" name="ClassInfoMaterialFeeOptional" Value = "0" >
		<% else %>
		<small>Yes</small><input TYPE="RADIO" name="ClassInfoMaterialFeeOptional" Value = "1" >
		<small>No</small><input TYPE="RADIO" name="ClassInfoMaterialFeeOptional" Value = "0" checked>
		<% end if %>
  	 </td>
  	</tr>
   
		
  	<tr>
		<td class = "body" >
			<b>Date:</b></td>
			</tr>
  	<tr>
		<td>
		<select size="1" name="ClassDateMonth">

		<% if len(ClassDateMonth) > 0 then %>
					<option value="<%=ClassDateMonth%>" selected><%=ClassDateMonth%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>
				<select size="1" name="ClassDateDay">
		<% if len(ClassDateDay) > 0 then %>
					<option value="<%=ClassDateDay%>" selected><%=ClassDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>
		<select size="1" name="ClassDateYear">
				<% if len(ClassDateYear) > 0 then %>
					<option value="<%=ClassDateYear%>" selected><%=ClassDateYear%></option>
				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
		</td>
	   </tr>
<tr>
  	<td class = "body"  ><b>Start Time:</b></td>
  	</tr>
  	<tr>
  	<td> <input type="text" name = "ClassStartTime" size = 9 maxsize = 9 value = "<%=ClassStartTime%>" ></td>
</tr>
<tr>
  	<td class = "body"  ><b>End Time:</b></td>
  	</tr>
  	<tr>
  	<td> <input type="text" name = "ClassEndTime" size = 9 maxsize = 9  value = "<%=ClassEndTime%>"></td>
</tr>
<tr>
  	<td class = "body"  ><b>Room:</b></td>
  	</tr>
  	<tr>
  	<td> <input type="text" name = "ClassInfoRoomDesignation" size = 30 value = "<%=ClassInfoRoomDesignation%>"></td>
</tr>

<tr>
  	<td class = "body" ><b>Min. # Students:</b></td>
  	</tr>
  	<tr>
  	<td class = "body" ><input class="positive" type="text" name = "ClassInfoMinimumStudents" size = 7 maxsize = 9 value = "<%=ClassInfoMinimumStudents%>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>

  	 <tr>
  	<td class = "body" ><b>Max. # Students:</b></td>
  	</tr>
  	<tr>
  	<td class = "body" ><input class="positive" type="text" name = "ClassInfoMaximumStudents" size = 7 maxsize = 9 value = "<%=ClassInfoMaximumStudents%>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
		 <tr><td class = "body"  ><b>Instructor's Name:</b></td>
		 </tr>
  	<tr>
  	<td> <input type="text" name = "Instructorsname" size = 30  value = "<%=Instructorsname%>"></td>
</tr>
	<tr><td class = "body"  ><b>Instructor's Website:</b></td>
	</tr>
  	<tr>
  	<td class = "body">http://<input type="text" name = "InstructorsWebsite" size = 30 value = "<%=InstructorsWebsite%>"></td>
</tr>
</table>
</td>

<%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>   
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>


<script language="javascript1.2">
  // attach the editor to the textarea with the identifier 'textarea1'.
   WYSIWYG.attach("textarea1");
</script> 


<script language="javascript1.2">
  // attach the editor to the textarea with the identifier 'textarea1'.
   WYSIWYG.attach("textarea3");
</script> 

 <td class = "body"><b>Class Description:</b><br><TEXTAREA NAME="ClassInfoDescription" cols="70" rows="11" wrap="file" id = "textarea1"><%=ClassInfoDescription %></textarea><br>
 
<b>Instructor's Bio:</b><br><TEXTAREA NAME="InstructorsBio" cols="70" rows="11" wrap="file" id = "textarea3"><%=InstructorsBio %></textarea>
 </td>
</tr>
</table>
  
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>

<table width = "900" align = "center">
<tr><td colspan = "4" align = "center"><input type = "hidden" name="TotalCount" value= "<%= rowcount - 1 %>" >
	<center>
	<br>
    <input type="submit" value="Update Class"  class = "regsubmit2" >

</center>
	</td></tr></table>
	

</form>
<% end if %>



<br>
<% else %>



<% 
	row = "odd"
	rowcount = 1
 	sql = "select * from ClassInfo  where EventID = " & EventID
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
%>

 <% PageTitleText = "Edit Classes"  %>
<!--#Include file="970Top.asp"-->
<br />
	<table border = "0" bordercolor = "#DBF5F3"  cellpadding=0 cellspacing=0 width = "900" align = "center" >
	<form action= 'ClassesEditHandleForm.asp#Edit' method = "post">
	<input name="Action"  size = "60" value = "Update" type = "hidden">
	<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">
<% 	
	rowcount = 1  
	if not rs.eof then %>

	  <tr bgcolor = "#DBF5F3">
	  <td class="body" align = "center" width= "400">
	      <b>Class Title</b>
     </td>
     <td class="body" align = "left" width = "150">
	       <b>Instructor</b>
	 </td>
	 <td class="body" align = "center" width = "80">
	       <b>Date</b>
	 </td>
	 <td class="body" align = "center">
	       <b>Actions</b>
	  </td>
	</tr>
	<tr><td class = "body" colspan= "6" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>

	
	
   <% end if 
	
	
	While Not rs.eof %>
	
	
	<%
	InstructorFirstName = ""
		InstructorLastName= ""
	
		ClassInfoTitle = rs("ClassInfoTitle")
        instructorsName = rs("instructorsName")
	    instructorsWebsite = rs("instructorsWebsite")
	    instructorsBio = rs("instructorsBio")
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
	if len(instructorPeopleID) > 0 then	
		sql4 = "select PeopleFirstName, PeopleLastName from People  where PeopleID = " & instructorPeopleID
    Set rs4 = Server.CreateObject("ADODB.Recordset")
    rs4.Open sql4, conn, 3, 3   
	if not rs4.eof then 
		InstructorFirstName = rs4("PeopleFirstName")
		InstructorLastName = rs4("PeopleLastName")
	end if
	rs4.close
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
	     <td class="body">
	       <a href = "ClassesEditDetails.asp?ClassInfoID=<%=ClassInfoID%>&EventID=<%=EventID%>"><%=ClassInfoTitle %></a>
	     </td>
	     <td class="body" >
	        <a href = "ClassesEditDetails.asp?ClassInfoID=<%=ClassInfoID%>&EventID=<%=EventID%>"><%=InstructorsName%></a>
	     </td>
 		<td class="body" >
	      <a href = "ClassesEditDetails.asp?ClassInfoID=<%=ClassInfoID%>&EventID=<%=EventID%>">
	      	<% if len(ClassDateMonth) > 1 then %>
	      		  <%=ClassDateMonth%>/
	      	<% end if %>
	      	<% if len(ClassDateDay) > 1 then %>
	      		  <%=ClassDateDay%>/
	      	<% end if %>

			<%=ClassDateYear%></a>
	     </td>
     	<td class="body" align = "center">
	      <a href = "ClassesEditDetails.asp?ClassInfoID=<%=ClassInfoID%>&EventID=<%=EventID%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Class"></a>&nbsp;&nbsp;&nbsp; 
	      <a href = "ClassesDeleteHandleForm0.asp?ClassInfoID=<%=ClassInfoID%>&EventID=<%=EventID%>&ReturnPage=ClassesEditDetails.asp"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Class"></a>&nbsp;&nbsp;&nbsp;
		   <a href = "ClassesPhotos.asp?ClassInfoID=<%=ClassInfoID%>&EventID=<%=EventID%>"><img src = "images/Photo.gif" width = "15" border = "0" alt = "Upload Class Photos"></a>
	     </td>
	   </tr>
  
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>

</form>
<% end if %>

<% end if  %>
<br>

<!--#Include file="970Bottom.asp"--><br>

<!--#Include virtual="Footer.asp"-->

</Body>
</HTML>