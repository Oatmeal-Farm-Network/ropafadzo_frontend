<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<%@ Language=VBScript %>

<HTML>
<HEAD>
<title>Classes Overview</title>
<link rel="stylesheet" type="text/css" href="style.css">
<!--#Include virtual="globalVariables.asp"--> 

</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<% PeopleIDNeeded = True %>
<!--#Include virtual="Header.asp"--> 
<!--#Include virtual="ClassesHeader.asp"--> 

<a name= "Classes"></a>
<table border = "0"  cellpadding=0 cellspacing=0 width = "900" align = "center" >
	<tr>
	   <td  valign = "top" align = "center"  colspan = "3"><br><h2>Classes Overview</h2></td>
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

<br>



<%
EventID = request.querystring("EventID")

If Request.Querystring("UpdateClasses" ) = "True" Then
   ServicesID= Request.Form("ServicesID") 
	FeePerAnimal = Request.Form("FeePerAnimal")
	FeePerPen  = Request.Form("FeePerPen")
	MaxQTYCheckbox = Request.Form("MaxQTYCheckbox")
	MaxQTY = Request.Form("MaxQTY")
	MaxQTY2 = Request.Form("MaxQTY2")
	ServiceEndDateMonth = Request.Form("ServiceEndDateMonth")
	ServiceEndDateDay = Request.Form("ServiceEndDateDay")
	ServiceEndDateYear = Request.Form("ServiceEndDateYear")
	Description = Request.Form("Description")
	EventID = Request.Form("EventID")
	EventSubTypeID = Request.Form("EventSubTypeID")
	VetCheckFee  = Request.Form("VetCheckFee")
 	ElectrictyFee  = Request.Form("ElectrictyFee")
  	MaxPensPerFarm  = Request.Form("MaxPensPerFarm")
 	StallMatsAvailable  = Request.Form("StallMatsAvailable")
 	StallMatPrice  = Request.Form("StallMatPrice")

	Price1Discount= Request.Form("Price1Discount")
	Price1DiscountStartDateMonth  = Request.Form("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = Request.Form("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = Request.Form("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = Request.Form("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = Request.Form("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = Request.Form("Price1DiscountEndDateYear")

	
	Price2Discount= Request.Form("Price2Discount")
	Price2DiscountStartDateMonth  = Request.Form("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = Request.Form("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = Request.Form("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = Request.Form("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = Request.Form("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = Request.Form("Price2DiscountEndDateYear")

	Price3  = Request.Form("Price3")
	Price3Discount= Request.Form("Price3Discount")
	Price3DiscountStartDateMonth  = Request.Form("Price3DiscountStartDateMonth")
	Price3DiscountStartDateDay  = Request.Form("Price3DiscountStartDateDay")
	Price3DiscountStartDateYear  = Request.Form("Price3DiscountStartDateYear")
	Price3DiscountEndDateMonth  = Request.Form("Price3DiscountEndDateMonth")
	Price3DiscountEndDateDay  = Request.Form("Price3DiscountEndDateDay")
	Price3DiscountEndDateYear  = Request.Form("Price3DiscountEndDateYear")


'response.write("StopDate=" & StopDate)


str1 = Description
str2 = "'"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "''")
	
End If  


Query =  " UPDATE Services Set Description = '" &  Description & "',"
 if len(MaxQTY) > 0 then
Query =  Query & " ServiceMaxQuantity  = " &  MaxQTY  & "," 
end if
 if len(MaxQTY2) > 0 then
Query =  Query & " ServiceMaxQuantity2  = " &  MaxQTY2  & "," 
end if

 if len(FeePerAnimal) > 0 then
  Query =  Query & " Price  = " &  FeePerAnimal & "," 
else
  Query =  Query & " Price  = 0," 
end if


 if len(StallMatsAvailable) > 0 then
  Query =  Query & " StallMatsAvailable  = " &  StallMatsAvailable & "," 
  else
  Query =  Query & " StallMatsAvailable  = 0," 
end if


 if len(StallMatPrice) > 0 then
  Query =  Query & " StallMatPrice  = " &  StallMatPrice & "," 
  else
  Query =  Query & " StallMatPrice  = 0," 
end if


 if len(VetCheckFee) > 0 then
  Query =  Query & " VetCheckFee  = " &  VetCheckFee & "," 
else
  Query =  Query & " VetCheckFee  = 0," 
end if

 if len(ElectrictyFee) > 0 then
  Query =  Query & " ElectrictyFee  = " &  ElectrictyFee & "," 
else
  Query =  Query & " ElectrictyFee  = 0," 
end if


 if len(MaxPensPerFarm) > 0 then
  Query =  Query & " MaxPensPerFarm  = " &  MaxPensPerFarm & "," 
else
  Query =  Query & " MaxPensPerFarm  =  0," 
end if



 if len(ServiceEndDateMonth) > 0 then
  Query =  Query & " ServiceEndDateMonth  = " &  ServiceEndDateMonth & "," 
end if

 if len(ServiceEndDateDay) > 0 then
  Query =  Query & " ServiceEndDateDay  = " &  ServiceEndDateDay & "," 
end if

 if len(ServiceEndDateYear) > 0 and (len(ServiceEndDateMonth) > 0 or len(ServiceEndDateDay) > 0 ) then
  Query =  Query & " ServiceEndDateYear  = " &  ServiceEndDateYear & "," 
end if



 if len(Price1Discount) > 0 then
  Query =  Query & " Price1Discount  = " &  Price1Discount & "," 
else
  Query =  Query & " Price1Discount  = 0," 
end if



if len(Price1DiscountstartDateMonth) > 0 then
  Query =  Query & " Price1DiscountstartDateMonth  = " &  Price1DiscountstartDateMonth & "," 
end if

 if len(Price1DiscountstartDateDay) > 0 then
  Query =  Query & " Price1DiscountstartDateDay  = " &  Price1DiscountstartDateDay & "," 
end if

 if len(Price1DiscountstartDateYear) > 0 and (len(Price1DiscountstartDateMonth) > 0 or len(Price1DiscountstartDateDay)) then
  Query =  Query & " Price1DiscountstartDateYear  = " &  Price1DiscountstartDateYear & "," 
end if

 if len(Price1DiscountEndDateMonth) > 0 then
  Query =  Query & " Price1DiscountEndDateMonth  = " &  Price1DiscountEndDateMonth & "," 
end if

 if len(Price1DiscountEndDateDay) > 0 then
  Query =  Query & " Price1DiscountEndDateDay  = " &  Price1DiscountEndDateDay & "," 
end if

 if len(Price1DiscountEndDateYear) > 0 and ( len(Price1DiscountEndDateMonth) > 0 or len(Price1DiscountEndDateDay) > 0 ) then
  Query =  Query & " Price1DiscountEndDateYear  = " &  Price1DiscountEndDateYear & "," 
end if


if len(Price2Discount) > 0 then
  Query =  Query & " Price2Discount  = " &  Price2Discount & "," 
else
  Query =  Query & " Price2Discount  = 0," 
end if



if len(Price2DiscountstartDateMonth) > 0 then
  Query =  Query & " Price2DiscountstartDateMonth  = " &  Price2DiscountstartDateMonth & "," 
end if

 if len(Price2DiscountstartDateDay) > 0 then
  Query =  Query & " Price2DiscountstartDateDay  = " &  Price2DiscountstartDateDay & "," 
end if

 if len(Price2DiscountstartDateYear) > 0 and (len(Price2DiscountstartDateMonth) > 0  or len(Price2DiscountstartDateDay) > 0 ) then
  Query =  Query & " Price2DiscountstartDateYear  = " &  Price2DiscountstartDateYear & "," 
end if

 if len(Price2DiscountEndDateMonth) > 0 then
  Query =  Query & " Price2DiscountEndDateMonth  = " &  Price2DiscountEndDateMonth & "," 
end if

 if len(Price2DiscountEndDateDay) > 0 then
  Query =  Query & " Price2DiscountEndDateDay  = " &  Price2DiscountEndDateDay & "," 
end if

 if len(Price2DiscountEndDateYear) > 0 and (len(Price2DiscountEndDateMonth) > 0 or len(Price2DiscountEndDateDay) > 0  ) then
  Query =  Query & " Price2DiscountEndDateYear  = " &  Price2DiscountEndDateYear & "," 
end if





 if len(FeePerPen) > 0 then
  Query =  Query & " Price2  = " &  FeePerPen & "," 
else
  Query =  Query & " Price2  = 0," 
end if


 if len(StopDate1) > 0 then
 Query =  Query & " ServiceEndDate  = '" &  StopDate1 & "'," 
end if 

 Query =  Query & " ExtraField  = ''" 
Query =  Query & " where servicesID = " & ServicesID & " and EventID = " &  EventID & "" 


'response.write("Query = " & Query)
Conn.Execute(Query) 
end if


%>


<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "950" align = "center">
	<tr>
	   
 <td valign = "top">  

<% 

sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Classes / Workshops' and EventID =  " & EventID & " Order by ServicesID Desc"
	'response.write("sql=" & sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	
	ServicesID = rs("ServicesID")

	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")
	
	Price1Discount= rs("Price1Discount")
	Price1DiscountStartDateMonth  = rs("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = rs("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = rs("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = rs("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = rs("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = rs("Price1DiscountEndDateYear")

	
	Price2Discount= rs("Price2Discount")
	Price2DiscountStartDateMonth  = rs("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = rs("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = rs("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = rs("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = rs("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = rs("Price2DiscountEndDateYear")
 	StallMatsAvailable  = rs("StallMatsAvailable")
 	StallMatPrice  = rs("StallMatPrice")
	ElectrictyFee = rs("ElectrictyFee")
	VetCheckFee = rs("VetCheckFee")
	MaxPensPerFarm = rs("MaxPensPerFarm")
	StallMatsAvailable = rs("StallMatsAvailable")
	StallMatPrice = rs("StallMatPrice")
		
	EventTypeID = rs("EventTypeID")
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	MaxQTY =  rs("ServiceMaxQuantity")
	MaxQTY2 =  rs("ServiceMaxQuantity2")
	if len(MaxQTY2) > 0 then
	  MaxQTYCheckbox = "checked"
	end if

	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
	  StopDate = "checked"
	end if
	Description =  rs("Description")


str1 = Description
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , vbCrLf)
	
End If  


str1 = Description
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, " ")
End If 

str1 = Description
str2 = "''"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "'")
End If 

	
End If 



if FeePerAnimal = "0" then
   FeePerAnimal = ""
end if

if Price1Discount = "0" then
   Price1Discount = ""
end if

if Price2Discount = "0" then
   Price2Discount = ""
end if


if FeePerPen = "0" then
   FeePerPen = ""
end if


%>




<form  name=Classesform method="post" action="ClassesHome.asp?EventID=<%=EventID%>&UpdateClasses=True">
 <table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "950" align = "center" >
 <tbody>
<tr>
<td class= "body2" valign = "top" >
		<table  border = "0" cellpadding=0 cellspacing = "0" width = "500">
		<tr>
 			<td class = "body2" colspan = "2"><br><h2>Classes Overall Description</h2></td>
 		</tr>
 		<tr>
 		  <td>
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
 		  
 		  
 		  </td>
 		 </tr>
 		</TABLE>

 

	  <textarea name="Description" cols="60" rows="6" wrap="VIRTUAL" id = "textarea1"><%= Description%></textarea> </td>
	</tr>
	<tr><td colspan = "3" class = "body2" align = "center">
		<input type = "hidden"  name ="ServicesID"  value ="<%=ServicesID%>">
	<input type = "hidden"  name ="EventID"  value ="<%=EventID%>">
	<input type = "hidden"  name ="EventSubTypeID"  value ="<%=EventSubTypeID%>">
	<input type="submit"  value="Submit Changes" class = "Regsubmit2" ><br>
	
	
	</td>
	</tr>
</table>
</td>
 		 </tr>
 		</TABLE>

</form>



<br>
 
<!--#Include virtual="Footer.asp"--> 

</Body>
</HTML>
