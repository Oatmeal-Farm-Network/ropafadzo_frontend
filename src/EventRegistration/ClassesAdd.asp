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

<% PageTitleText = "Classes / Workshops"  %>
<!--#Include file="970Top.asp"-->

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

<% 

 EventID = request.querystring("EventID") 
 sql = "select * from Classinfo where EventID = " & EventID & ""

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if not rs.eof then

'publish= rs("publish")
MissingTitle = Request.querystring("MissingTitle")
InstructorsName= Request.querystring("InstructorsName")
	InstructorsWebsite= Request.querystring("InstructorsWebsite")
	InstructorsBio= Request.querystring("InstructorsBio")
	ClassInfoStudentFee = Request.querystring("ClassInfoStudentFee")
	ClassDateMonth = Request.querystring("ClassDateMonth")
	ClassDateDay = Request.querystring("ClassDateDay")
	ClassDateYear = Request.querystring("ClassDateYear")
	ClassStartTime = Request.querystring("ClassStartTime")
	ClassEndTime = Request.querystring("ClassEndTime")
	ClassInfoRoomDesignation = Request.querystring("ClassInfoRoomDesignation")
	ClassInfoMinimumStudents = Request.querystring("ClassInfoMinimumStudents")
	ClassInfoMaximumStudents = Request.querystring("ClassInfoMaximumStudents")
	ClassInfoDescription = Request.querystring("ClassInfoDescription")


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

<a name="Top"></a>

 <% PageTitleText = "Add a Class - Step 1: Enter Information"  %>
<!--#Include file="970Top.asp"-->
<br />

<form name = "AddForm" action= 'ClassesAddHandleForm.asp?EventID=<%=EventID%>' method = "post">
<input name="Action"  size = "60" value = "Add" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">
<table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" ><tr><td class = "body" colspan  "2"> * = required field<br>
<% if len(MissingTitle) > 0 then%>
<font Color = "brown"><b>Your class was not added. Please enter a title and resubmit the form.</b></font>
<% end if %>
</td>
 </tr>
  
<% Message = ""
Message = request.querystring("Message")
if len(Message) > 1 then
%>

<tr>
 <td class = "menu2" ><font color = "red"><%=Message%></font><br>
 To add another class please use the form below, or to edit your classes please <a href ="ClassesEdit.asp?EventID=<%=EventID%>" class = "menu2">click here</a>.<br><br><br>
 </td>
 </tr>

<%
end if 

row = "odd"
%>

 <tr>
 <td >
<table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
<tr >
  <td class = "body" valign = "top" >
  <table>
  <tr>
  	<td class = "body"   valign = "top"><% if len(MissingTitle) > 0 then%>
<font Color = "brown"><% end if %><b>Title*:</b><% if len(MissingTitle) > 0 then%>
</font><% end if %></td>
</tr>
<tr>
  	<td  valign = "top">
 	
  	<TEXTAREA NAME="ClassInfoTitle" cols="30" rows="3" wrap="file"  ><%=ClassInfoTitle %></textarea>
  	
  	</td>
   </tr>
  
    <tr>
  	<td class = "body"   valign = "top"><b>Price*:</b></td>
  	</tr>
  	<tr>
  	<td class = "body"> $<input class="positive" type="text" name = "ClassInfoStudentFee" size = 7 maxsize = 9 value = "<%=ClassInfoStudentFee %>"><br>For free classes please enter "0" for the price.
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
  	<tr>
		<td class = "body">
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

		<small>Yes</small><input TYPE="RADIO" name="ClassInfoMaterialFeeOptional" Value = "1" >
		<small>No</small><input TYPE="RADIO" name="ClassInfoMaterialFeeOptional" Value = "0" checked>
		
  	 </td>
  	</tr>
  	<tr>
		<td class = "body">
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
  	<td class = "body" ><b>Start Time:</b></td>
  	  	</tr>
  	<tr>
  	<td> <input type="text" name = "ClassStartTime" size = 9 maxsize = 9 value = "<%=ClassStartTime%>"></td>
</tr>
<tr>
  	<td class = "body" ><b>End Time:</b></td>
  	  	</tr>
  	<tr>
  	<td> <input type="text" name = "ClassEndTime" size = 9 maxsize = 9 value = "<%=ClassEndTime%>"></td>
</tr>
<tr>
  	<td class = "body" ><b>Room:</b></td>
  	  	</tr>
  	<tr>
  	<td> <input type="text" name = "ClassInfoRoomDesignation" size = 30 value = "<%=ClassInfoRoomDesignation%>"></td>
</tr>



  	 <tr>
  	<td class = "body" ><b>Min. # Students:</b></td>
  		</tr>
  	<tr>
  	<td class = "body" ><input class="positive" type="text" name = "ClassInfoMinimumStudents" size = 7 maxsize = 9 value = "<%=ClassInfoMinimumStudents%>" >
	
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
  <tr>
  <td class = "body" colspan = "2" align = "center"><br>
    <div  align = "center"><input type=submit value="Add Class"  class = "regsubmit2" ></div>
    <br>
</td>
</tr>
 </table>
</td>
</tr>
 </table>

</form>


<!--#Include file="970Bottom.asp"-->

<!--#Include virtual="Footer.asp"-->

</Body>
</HTML>