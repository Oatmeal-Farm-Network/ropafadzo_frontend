<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>


<% 


EventID = request.querystring("EventID")
'response.write("EventID = " & EventID & "<br>")

 sql = "select * from Classinfo where EventID = " & EventID & ""
'response.write(sql)

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if rs.eof then %>

<table border = "0" bordercolor = "#DBF5F3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
<tr>
 <td class = "body2" colspan  "2">Currently there are no classes listed. To add classes please <a href ="ClassesAdd.asp?EventID=<%=EventID%>" class = "body">click here</a>.<br>
</td>
 </tr>
</table>

<% else

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




<a name="Edit">
<% 
row = "odd"
rowcount = 1
 sql = "select * from ClassInfo  where EventID = " & EventID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if not rs.eof then %>

<table border = "0" bordercolor = "#DBF5F3"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
<tr>
 <td class = "body2" width = "200">* = required field<br>
</td>
 </tr>


<form action= 'ClassesEditHandleForm.asp#Edit' method = "post">
<input name="Action"  size = "60" value = "Update" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">





	
<% 	
rowcount = 1

While Not rs.eof  
	
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
  If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if
 If row = "even" Then %>
	<table border = "0"  width = "940"  cellpadding=0 cellspacing=0 align = "center" bgcolor = "#DBF5F3">
<% Else %>
	<table border = "0" width = "940"  cellpadding=0 cellspacing=0 align = "center" bgcolor = "white">
<% End If %>
 
<tr >
  <td class = "body2" valign = "top" >
  <table>
  <tr>
  	<td class = "body2"  align = "right" valign = "top"><small>Title: *</small></td>
  	<td>
  	<input name="ClassInfoID(<%=rowcount%>)"  size = "60" value = "<%=ClassInfoID%>" type = "hidden">
  	<TEXTAREA NAME="ClassInfoTitle(<%=rowcount%>)" cols="30" rows="3" wrap="file"  align = "right"><%=ClassInfoTitle%></textarea>
  	
  	</td>
   </tr>
   <tr>
  	<td class = "body2" align = "right" valign = "top"><small>Instructor: </small></td>
  	<td>  	<select size="1" name="InstructorID(<%=rowcount%>)">
  	
  	  	<% Set rs2 = Server.CreateObject("ADODB.Recordset")
  	  	sql2 = "select * from People where PeopleID = " & instructorPeopleID
   		rs2.Open sql2, conn, 3, 3 

          InstructorFirstName = rs2("PeopleFirstName")
          InstructorLastName = rs2("PeopleLastName")
    
%>
<option value="<%=instructorPeopleID %>"><%=InstructorFirstName %>&nbsp; <%=InstructorLastName %></option>




  	<% sql2 = "select * from People, Address where People.AddressID = Address.AddressID and  People.instructor = True "

'response.write (sql)
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
	
	While Not rs2.eof  %>


					<option value="<%=rs2("PeopleID") %>"><%=rs2("PeopleFirstName") %>&nbsp; <%=rs2("PeopleLastName") %></option>
			

  <%	rs2.movenext
  	wend %>
  	
  		</select>
</td>
   </tr>
    <tr>
  	<td class = "body2" align = "right" width = "70"><small>Price: *</small></td>
  	<td class = "body"> $<input class="positive" type="text" name = "ClassInfoStudentFee(<%=rowcount%>)" size = 7 maxsize = 9 value = "<%=ClassInfoStudentFee%>">
  	<br><small><i>For free classes please enter "0" for the price.</i></small>

	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
  	<tr>
		<td class = "body2" align = "right">
			<small>Date: &nbsp;</small></td>
		<td>
		<select size="1" name="ClassDateMonth(<%=rowcount%>)">

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
				<select size="1" name="ClassDateDay(<%=rowcount%>)">
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
		<select size="1" name="ClassDateYear(<%=rowcount%>)">
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
  	<td> <input type="text" name = "ClassStartTime(<%=rowcount%>)" size = 9 maxsize = 9 value = "<%=ClassStartTime%>" ></td>
</tr>
<tr>
  	<td class = "body2" align = "right" width = "70"><small>End Time:</small></td>
  	<td> <input type="text" name = "ClassEndTime(<%=rowcount%>)" size = 9 maxsize = 9  value = "<%=ClassEndTime%>"></td>
</tr>
<tr>
  	<td class = "body2" align = "right" width = "70"><small>Room:</small></td>
  	<td> <input type="text" name = "ClassInfoRoomDesignation(<%=rowcount%>)" size = 30 value = "<%=ClassInfoRoomDesignation%>"></td>
</tr>

<tr>
  	<td class = "body2" align = "right"><small>Min. # Students:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "ClassInfoMinimumStudents(<%=rowcount%>)" size = 7 maxsize = 9 value = "<%=ClassInfoMinimumStudents%>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>

  	 <tr>
  	<td class = "body2" align = "right"><small>Max. # Students:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "ClassInfoMaximumStudents(<%=rowcount%>)" size = 7 maxsize = 9 value = "<%=ClassInfoMaximumStudents%>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
	 
<tr>
	  <td class = "body2" align = "right" ></td>
  		<td class = "body2"bgcolor = "brown" >
		<input TYPE="Checkbox" name="Delete(<%=rowcount%>)" Value = "Yes" ><font color = "white">Delete</font>
		</td>
	</tr>

	</table>
</td>
 <td class = "body2"><small>Description:</small><br><TEXTAREA NAME="ClassInfoDescription(<%=rowcount%>)" cols="70" rows="11" wrap="file"><%=ClassInfoDescription%></textarea><br>
 <small>Homework:</small><br><TEXTAREA NAME="ClassHomework(<%=rowcount%>)" cols="70" rows="7" wrap="file"><%=ClassHomework%></textarea>
 
 
 </td>
  </tr>
 </table>
  
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</td></tr></table>
<tr><td colspan = "4" align = "center"><input type = "hidden" name="TotalCount" value= "<%= rowcount - 1 %>" >
	<center>
	<br>
    <input type="submit" value="Update Classes"  class = "regsubmit2" >

</center>
	
	<br><br><br>
</td></tr></table>

</form>
<% end if %>