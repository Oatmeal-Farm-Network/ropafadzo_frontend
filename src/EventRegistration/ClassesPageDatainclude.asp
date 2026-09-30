<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

<%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>   
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>

	 
<script language="javascript1.2">
  // attach the editor to the textarea with the identifier 'textarea1'.
   WYSIWYG.attach("ID1");
</script> 

<script language="javascript1.2">
  // attach the editor to the textarea with the identifier 'textarea1'.
   WYSIWYG.attach("ID2");
</script> 


<% 

 EventID = request.querystring("EventID") 
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
<SCRIPT LANGUAGE="JavaScript">
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



<a name="Top"></a>
<form name = "AddForm" action= 'ClassesAddHandleForm.asp' method = "post">
<input name="Action"  size = "60" value = "Add" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">
<table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
<tr><td class = "body2" colspan  "2"><big><b>Add a Class</b></big></td></tr>
<tr><td class = "body2" colspan  "2" bgcolor = "black" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr><td class = "body2" colspan  "2"> * = required field<br>

 </tr>
  
<% Message = ""
Message = request.querystring("Message")
if len(Message) > 1 then
%>

<tr>
 <td class = "body2" ><font color = "red"><%=Message%></font><br>
 To add another class please use the form below, or to edit your classes please <a href ="ClassesEdit.asp?EventID=<%=EventID%>" class = "body">click here</a>.<br><br>
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
  <td class = "body2" valign = "top" >
  <table>
  <tr>
  	<td class = "body2"  align = "right" valign = "top"><small>Title: *</small></td>
  	<td  valign = "top">
  	<TEXTAREA NAME="ClassInfoTitle" cols="30" rows="3" wrap="file"  ></textarea>
  	
  	</td>
   </tr>
   <tr>
  	<td class = "body2"  align = "right" valign = "top"><small>Instructor: </small></td>
  	<td>
  	
  	<select size="1" name="InstructorID">

  	<%sql2 = "select * from People, Address where People.AddressID = Address.AddressID and  People.instructor = True "

	'response.write (sql)
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3 %>
      
	<option value="<%=rs2("PeopleID") %>">None</option>

	<% While Not rs2.eof  %>

		<option value="<%=rs2("PeopleID") %>"><%=rs2("PeopleFirstName") %>&nbsp; <%=rs2("PeopleLastName") %></option>
			

		<%	rs2.movenext
  	wend %>
  	
  		</select><br>
  <small><font class="menu2">To edit instructors please </font></small><a href="ClassesEditInstructors.asp?EventID=<%=eventid%>" class="menu2"><small>click here</small></a>
</td>
   </tr>
    <tr>
  	<td class = "body2" align = "right" width = "70" valign = "top"><small>Price: *</small></td>
  	<td class = "body2"> $<input class="positive" type="text" name = "ClassInfoStudentFee" size = 7 maxsize = 9 ><br><small>For free classes please enter "0" for the price.</small>
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
  	<tr>
		<td class = "body2" align = "right">
			<small>Date: &nbsp;</small></td>
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
						'response.write(currentyear)
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
		</td>
	   </tr>
<tr>
  	<td class = "body2" align = "right" width = "70"><small>Start Time:</small></td>
  	<td> <input type="text" name = "ClassStartTime" size = 9 maxsize = 9 ></td>
</tr>
<tr>
  	<td class = "body2" align = "right" width = "70"><small>End Time:</small></td>
  	<td> <input type="text" name = "ClassEndTime" size = 9 maxsize = 9 ></td>
</tr>
<tr>
  	<td class = "body2" align = "right" width = "70"><small>Room:</small></td>
  	<td> <input type="text" name = "ClassInfoRoomDesignation" size = 30 ></td>
</tr>



  	 <tr>
  	<td class = "body2" align = "right"><small>Max. # Students:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "ClassInfoMaximumStudents" size = 7 maxsize = 9 >
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
	
<tr>
  	<td class = "body2" align = "right"><small>Min. # Students:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "ClassInfoMinimumStudents" size = 7 maxsize = 9 >
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr></table>
</td>

 <td class = "body2">Class Description:<br><TEXTAREA NAME="ClassInfoDescription" cols="70" rows="11" wrap="file" id = "ID1"></textarea><br>
 Homework:<br><TEXTAREA NAME="ClassHomework" cols="70" rows="11" wrap="file" id = "ID2"></textarea>
 
 
 </td>
  </tr>
  <tr>
  <td class = "body2" colspan = "2" align = "center"><br>
    <input type=button value="Add Class"  class = "regsubmit2" onclick="verify();">
    <br>
</td>
</tr>
 </table>
</td>
</tr>
 </table>

</form>

