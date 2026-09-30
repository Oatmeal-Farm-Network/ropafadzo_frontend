<a name= "Classes">
<table border = "0"  cellpadding=0 cellspacing=0 width = "900" align = "center" >
	<tr>
	   <td  valign = "top" align = "center"  colspan = "3"><h2>Classes Overview</h2></td>
	</tr>
	<tr><td class = "body2" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	<tr><td class = "body2" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	 <tr>
</table>

<table border = "0"  cellpadding=0 cellspacing=0 width = "900" align = "center" >
         	 	<%
sql = "select * from ClassReg  where EventID = " & EventID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if  rs.eof then %>
<tr>
   <td   class = "menu2">Currently you do not have any classes listed. To add classes please select  <a href = "ClassesAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Classes</a>.
   </td>
 </tr>


<% else %>


	 <tr>
   <td   class = "menu2"><img src = "images/px.gif" width = "20" height = "20" >
	 Classes / Workshops Overview | 
	 <a href = "ClassesAddInstructors.asp?EventID=<%=eventID%>" class = "menu2">Add Instructors</a> |
    	    	<a href = "ClassesEditInstructors.asp?EventID=<%=eventID%>" class = "menu2">Edit Instructors</a> |

 	 <a href = "ClassesAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Classes</a> |&nbsp; 

<%
 sql = "select * from ClassInfo  where EventID = " & EventID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if not rs.eof then %>
	<a href = "ClassesAdd.asp?EventID=<%=EventID%>#Edit" class = "menu2">Edit Classes</a> |&nbsp; 
	 	
    	


	 
 
     <a href = "StudentsAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Students</a> | 
	 <a href = "StudentsEdit.asp?EventID=<%=EventID%>" class = "menu2">Edit Students</a> | 
	 <% end if %>  
	 </td>
	</tr>
<tr><td class = "body2" colspan  "3" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<% 

 row = "odd"
rowcount = 1


dim ClassInfoIDArray(10000)
dim ClassNameArray(1000)
dim ClassPriceArray(10000)
dim AmountPaidArray(10000)
dim AmountDueArray(10000)
dim NumStudentsArray(10000)
dim instructornameArray(100000)
dim instructorPeopleIDArray(100000)
TotalAmountPaidCounter = 0
TotalAmountDueCounter =  0
TotalNumStudentsCounter = 0
TotalIncomeCounter = 0
 
x = 1
sql = "select * from ClassInfo  where EventID = " & EventID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if not rs.eof then 
   ClassesSetup = True
else 
  ClassesSetup = False
end if

sql = "select * from ClassInfo where EventID =  " & EventID & " order by ClassInfoTitle"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
while Not rs.eof 
   ClassInfoIDArray(x) = rs("ClassInfoID") 
   ClassNameArray(x) = rs("ClassInfoTitle")
   ClassPriceArray(x) = rs("ClassInfoStudentFee")
   instructorPeopleIDArray(x) = rs("instructorPeopleID")
   
AmountPaidCounter = 0
AmountDueCounter = 0
NumStudentsCounter = 0
AmountIncomeCounter = 0



sql2 = "select PeopleFirstName, PeopleLastName from People where PeopleID =  " &  instructorPeopleIDArray(x)
'response.write(sql2)
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3   
if Not rs2.eof then
  
instructornameArray(x) = rs2("PeopleLastName") & ", " & rs2("PeopleFirstName")


else

instructornameArray(x) = ""
end if 



sql2 = "select * from ClassReg where ClassInfoID =  " &  ClassInfoIDArray(x) 
'response.write(sql2)
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3   
while Not rs2.eof 
  AmountPaidCounter = AmountPaidCounter + rs2("ClassPaidAmount")
  AmountIncomeCounter =  AmountIncomeCounter + (rs2("NumberAttending") * ClassPriceArray(x))
  NumStudentsCounter = NumStudentsCounter + rs2("NumberAttending")



 rs2.movenext
wend

AmountPaidArray(x) = AmountPaidCounter
AmountDueArray(x) = AmountIncomeCounter - AmountPaidCounter
NumStudentsArray(x) = NumStudentsCounter

TotalAmountPaidCounter = TotalAmountPaidCounter + AmountPaidArray(x)
TotalAmountDueCounter =  TotalAmountDueCounter + AmountDueArray(x)
TotalNumStudentsCounter = TotalNumStudentsCounter + NumStudentsArray(x)
TotalIncomeCounter = TotalIncomeCounter + AmountIncomeCounter

 x= x + 1

rs.movenext
wend

totalcount = x 
if totalcount > 1 then
%><table border = "0" width = "900"  align = "center" bgcolor = "#DEF6F3" >
<tr>
<td class = "body2" align = "center"width = "125"><b>Class</b></td>
<td class = "body2" align = "center"width = "125"><b>Instructor</b></td>
<td class = "body2" align = "center" width = "150"><b>Price</b></td>
<td class = "body2" align = "center" width = "100"><b># Students</b></td>
<td class = "body2" align = "center" width = "90"><b>Total</b></td>
<td class = "body2" align = "center" width = "90"><b>Paid</b></td>
<td class = "body2" align = "center" width = "90"><b>Due</b></td>
<td class = "body2" align = "center" width = "130"><b>Actions</b></td>
</tr>
</table>

<% 
end if 
x = 0
while x < totalcount  - 1
x = x + 1

  If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if
 If row = "even" Then %>
	<table border = "0" width = "900"  align = "center" bgcolor = "white">

<% Else %>
	<table border = "0" width = "900"  align = "center" bgcolor = "#DEF6F3" >

<% End If %>

<tr>
<td class = "menu2" width = "125"><a href = "ClassesEditDetails.asp?ClassInfoID=<%=ClassInfoIDArray(x)%>&ClassName=<%=ClassNameArray(x) %>" class="menu2"><%=ClassNameArray(x) %></a></td>
<td class = "menu2" width = "125" align = "left"><a href = "ClassesEditInstructorsDetails.asp?PeopleID=<%=instructorPeopleIDArray(x)%>" class="menu2"><%=instructornameArray(x) %></a></td>

<td class = "menu2" align = "center" width = "150"><%=ClassPriceArray(x)%></td>
<td class = "menu2" align = "center" width = "100"><%=NumStudentsArray(x) %></td>
<td class = "menu2" align = "center" width = "90"><%=formatcurrency(NumStudentsArray(x) * ClassPriceArray(x),2) %><img src = "images/px.gif" width = "20" height = "1"></td>
<td class = "menu2" align = "center" width = "90"><% if len(AmountPaidArray(x)) > 1 then %>
	<%=formatcurrency(AmountPaidArray(x),2) %><img src = "images/px.gif" width = "20" height = "1">
	<% else %>
	0
	<% end if %>
	</td>
<td class = "menu2" align = "center" width = "90">
<% if len(AmountDueArray(x)) > 1 then %>
<%=formatcurrency(AmountDueArray(x),2) %><img src = "images/px.gif" width = "20" height = "1">
<% else %>
	0
	<% end if %>
</td>
<td class="body2" align = "center" width = "130">
	      <a href = "ClassesEditDetails.asp?ClassInfoID=<%=ClassInfoIDArray(x)%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Class"></a>&nbsp;&nbsp;&nbsp; 
	      <a href = "ClassesDeleteHandleForm0.asp?ClassInfoID=<%=ClassInfoIDArray(x)%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Class"></a>&nbsp;&nbsp;&nbsp;
		 <a href = "ClassesEditInstructorsDetails.asp?PeopleID=<%=instructorPeopleIDArray(x)%>" class="menu2"><img src = "images/instructor.jpg" width = "15" border = "0" alt = "Edit Instructor"></a>&nbsp;&nbsp;&nbsp;
		  <a href = "StudentsEdit.asp?EventID=<%=EventID%>"><img src = "images/Student.jpg" width = "15" border = "0" alt = "Edit Student"></a> 
	     </td>

</tr>
</table>

<% wend %>

<table border = "0" width = "900"  align = "center"  >
	<tr><td class = "body2" colspan = "7" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr>
<td class = "Menu2" align = "center"width = "250">&nbsp;</td>
<td class = "Menu2" align = "center" width = "150">&nbsp;</td>
<td class = "Menu2" align = "right" width = "100"><b>Totals:</b></td>
<td class = "Menu2" align = "center" width = "90">
<% if len(TotalIncomeCounter) > 1 then %>
	<%=formatcurrency(TotalIncomeCounter,2) %><img src = "images/px.gif" width = "20" height = "1">
	<% else %>
	0
	<% end if %>
<img src = "images/px.gif" width = "20" height = "1"></td>
<td class = "Menu2" align = "center" width = "90">
<% if len(TotalAmountPaidCounter) > 1 then %>
	<%=formatcurrency(TotalAmountPaidCounter,2) %><img src = "images/px.gif" width = "20" height = "1">
	<% else %>
	0
	<% end if %>

</td>
<td class = "Menu2" align = "center" width = "90">
<% if len(TotalAmountDueCounter) > 1 then %>
	<%=formatcurrency(TotalAmountDueCounter,2) %><img src = "images/px.gif" width = "20" height = "1">
	<% else %>
	0
	<% end if %>
</td>
<td width = "130">&nbsp;</td>
</tr>
 <% end if %> 
</table>

<br><br>