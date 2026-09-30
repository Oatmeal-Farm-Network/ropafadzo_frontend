<HTML>
<HEAD>

       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >

		<!--#Include virtual="Globalvariables.asp"-->

 
<table width = "680" height = "300"  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>

		
<td class = "body" valign = "top">

<% 

'rowcount = CInt
rowcount = 1
dim ClassOrderArray(10000) 
dim ClassInfoIDArray(10000)

Action= Request.Form("Action")
EventID = Request.Form("EventID")

response.write("action = " & Action  & " EventID = " & EventID )


'**************************************************************************************************************
'  FIND THE Points of Interest
'**************************************************************************************************************
If Action = "Add" Then
	i=0
	sql = "select * from ClassInfo where EventID = " & EventID  &  ""
	'response.write(sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   

	while Not rs.eof 
		i=i +1
		ClassInfoID = rs("ClassInfoID")

		sql3 = "select * from ClassiNfo where EventID = " & EventID 
		'response.write(sql3)
		Set rs3 = Server.CreateObject("ADODB.Recordset")
		rs3.Open sql3, conn, 3, 3 
	  
		if not rs3.eof then 
			ClassOrderArray(i) =  i 
			ClassInfoIDArray(i) = request.Form("class" & i )
  			'response.write("ClassOrderArray(i) =" & ClassOrderArray(i) & "<br>")
   			'response.write("ClassInfoIDArray(i) =" & ClassInfoIDArray(i) & "<br>")		
		end if 
		
 		rs.movenext
	wend
	rs.close

PeopleFirstName = Request.Form("PeopleFirstName")
PeopleLastName= Request.Form("PeopleLastName")
PeopleEmail= Request.Form("PeopleEmail")
PeoplePhone= Request.Form("PeoplePhone")
PeopleCell= Request.Form("PeopleCell")
PeopleFax= Request.Form("PeopleFax")
AddressID= Request.Form("AddressID")
AddressStreet= Request.Form("AddressStreet")
AddressApt= Request.Form("AddressApt")
AddressCity= Request.Form("AddressCity")
AddressState= Request.Form("AddressState")
AddressCountry= Request.Form("AddressCountry")
AddressZip= Request.Form("AddressZip")
NumberAttending = Request.Form("NumberAttending")
ClassPaidAmount = Request.Form("ClassPaidAmount")
ClassPaidAmountMonth = Request.Form("ClassPaidAmountMonth")
ClassPaidAmountDay = Request.Form("ClassPaidAmountDay")
ClassPaidAmountYear = Request.Form("ClassPaidAmountYear") 

response.write("ClassPaidAmount =" & ClassPaidAmount  )
response.write("ClassPaidAmountMonth =" & ClassPaidAmountMonth  )
str1 =PeopleFirstName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleFirstName= Replace(str1,  str2, "''")
	End If  

	str1 =PeopleLastName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleLastName= Replace(str1,  str2, "''")
	End If  

str1 =PeopleEmail
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleEmail= Replace(str1,  str2, "''")
	End If 
	
	
	str1 =PeoplePhone
		str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeoplePhone= Replace(str1,  str2, "''")
	End If 
	
	
	str1 =PeopleCell
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleCell= Replace(str1,  str2, "''")
	End If 
	
	str1 =PeopleFax
		str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleFax= Replace(str1,  str2, "''")
	End If 
	
	str1 =AddressStreet 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressStreet= Replace(str1,  str2, "''")
	End If 
	
	str1 =AddressApt 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressApt = Replace(str1,  str2, "''")
	End If 

	str1 =AddressCity 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressCity = Replace(str1,  str2, "''")
	End If 

	str1 =AddressState 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressState = Replace(str1,  str2, "''")
	End If 


	str1 =AddressState 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressState = Replace(str1,  str2, "''")
	End If 



	str1 =AddressZip 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressZip = Replace(str1,  str2, "''")
	End If 


if len(PeopleFirstName) > 0 or len(PeopleLastName) > 0 or len(PeopleEmail) > 0 or len(PeoplePhone) > 0 or len(PeopleCell) > 0 or len(PeopleFax) > 0 or len(AddressStreet) > 0 or len(AddressApt) > 0 or len(AddressCity) > 0 or len(AddressState) then 


Query =  "Update Address set AddressStreet = ' & AddressStreet & "',"
Query =  Query & " AddressApt = '" & AddressApt & "'," 
Query =  Query & " AddressCity = '" &  AddressCity & "'," 
Query =  Query & " AddressState = '" &  AddressState & "'," 
Query =  Query & " AddressZip = '" &  Addresszip & "'"
Query =  Query & " where AddressID = " & AddressID & ";" 




Dim cmdDC, RecordSet
Dim RecordToEdit, Updated

Conn.Execute(Query) 

 sql = "select AddressID from Address where AddressStreet = '" & AddressStreet & "' and AddressCity= '" & AddressCity & "' and AddressZip = '" & AddressZip  & "' order by AddressID Desc "
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
			AddressID = rs("AddressID")
	'response.write("AddressID=" & AddressID)

	End If 
rs.close




Query =  "Update People set PeopleFirstName = ' & PeopleFirstName & "',"
Query =  Query & " AddressID = " & AddressID & "," 
Query =  Query & " PeopleLastName = '" &  PeopleLastName & "'," 
Query =  Query & " PeoplePhone = '" &  PeoplePhone & "'," 
Query =  Query & " PeopleCell = '" &  PeopleCell & "'"
Query =  Query & " Peoplefax = '" &  Peoplefax & "'"
Query =  Query & " Peopleemail = '" &  Peopleemail & "'"
Query =  Query & " where PeopleID = " & PeopleID & ";" 


 


	'response.write("Query=" & Query)	
	Conn.Execute(Query) 
	sql = "select PeopleID from People where AddressID = " & AddressID  & " order by PeopleID Desc;"
	
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	If Not rs.eof Then
		PeopleID = rs("PeopleID")
	End If 
rs.close


'**************************************************************************************************************
'  FIND THE Points of Interest
'**************************************************************************************************************
i=0
sql = "select * from ClassInfo where EventID = " & EventID  &  ""
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

while Not rs.eof 
i=i +1
ClassInfoID = rs("ClassInfoID")



sql3 = "select * from ClassInfo where EventID = " & EventID 
'response.write(sql3)
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 

	ClassOrderArray(i) =  rs("ClassInfoID") 
	ClassInfoIDArray(i) = request.Form("class" & i )
    'response.write("ClassOrderArray(i) =" & ClassOrderArray(i) & "<br>")
    'response.write("ClassInfoIDArray(i) =" & ClassInfoIDArray(i) & "<br>")
  
if ClassInfoIDArray(i) ="on" then
 
 Query =  "INSERT INTO ClassReg (ClassInfoID, EventID, NumberAttending, "
 if len(ClassPaidAmount) > 0 then
 	Query =  Query & " ClassPaidAmount, "
 end if 
 
  if len(ClassPaidAmountMonth) > 0 then
 	Query =  Query & " ClassPaidAmountMonth, "
 end if
 
  if len(ClassPaidAmountDay) > 0 then
 	Query =  Query & " ClassPaidAmountDay, "
 end if
 
  if len(ClassPaidAmountYear) > 0 then
 	Query =  Query & " ClassPaidAmountYear, "
 end if
 
 
	Query =  Query & "  PeopleID ) " 
Query =  Query & " Values ('" &  ClassOrderArray(i) & "' ,"
Query =  Query & " " &  EventID & " ,"
Query =  Query & " " &  NumberAttending & " ,"
if len(ClassPaidAmount) > 0 then
 	Query =  Query & " " & ClassPaidAmount & " , "
 end if 
 
  if len(ClassPaidAmountMonth) > 0 then
 	Query =  Query & " " & ClassPaidAmountMonth & ", "
 end if
 
  if len(ClassPaidAmountDay) > 0 then
 	Query =  Query & " " & ClassPaidAmountDay & " , "
 end if
 
  if len(ClassPaidAmountYear) > 0 then
 	Query =  Query & " " & ClassPaidAmountYear & ", "
 end if
 
Query =  Query & " " & PeopleID & " )" 

response.write("Query=" & Query)	
Conn.Execute(Query) 

end if

rs3.movenext
  
end if 

 rs.movenext
wend
rs.close
 end if 
end if

response.write("Action=" & Action)
If Action = "Update" Then
response.write("Yippi!")
	TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
rowcount = 1


dim PeopleFirstName(10000)
dim PeopleLastName(10000)
dim PeopleEmail(10000)
dim PeoplePhone(10000)
dim PeopleCell(10000)
dim PeopleFax(10000)
dim AddressStreet(10000)
dim AddressApt(10000)
dim AddressCity(10000)
dim AddressState(10000)
dim AddressZip(10000)
dim delete(10000)
dim ClassInfoID(10000)
dim ClassRegID(10000)
dim ClassPaidAmount(10000)
dim	ClassPaidAmountMonth(10000)
dim	ClassPaidAmountDay(10000)
dim	ClassPaidAmountYear(10000)
dim NumberAttending(1000)
	

	NumberAttendingcount =  "NumberAttending(" & rowcount & ")"	
	PeopleFirstNamecount = "PeopleFirstName(" & rowcount & ")"	
	PeopleLastNamecount = "PeopleLastName(" & rowcount & ")"	
	PeopleEmailcount = "PeopleEmail(" & rowcount & ")"
	PeoplePhonecount = "PeoplePhone(" & rowcount & ")"
	PeopleCellcount = "PeopleCell(" & rowcount & ")"
	PeopleFaxcount = "PeopleFax(" & rowcount & ")"
	AddressStreetcount = "AddressStreet(" & rowcount & ")"
	AddressAptcount = "AddressApt(" & rowcount & ")"
	AddressCitycount = "AddressCity(" & rowcount & ")"
	AddressStatecount = "AddressState(" & rowcount & ")" 
	AddressZipcount = "AddressZip(" & rowcount & ")"
	AddressIDcount = "AddressID(" & rowcount & ")"	
	Deletecount = "Delete(" & rowcount & ")"
	AddressIDcount = "AddressID(" & rowcount & ")"
	ClassPaidAmountcount = "ClassPaidAmount(" & rowcount & ")"
ClassPaidAmountMonthcount = "ClassPaidAmountMonth(" & rowcount & ")"
ClassPaidAmountDaycount = "ClassPaidAmountDay(" & rowcount & ")"
ClassPaidAmountYearcount = "ClassPaidAmountYear(" & rowcount & ")"
 


	
	NumberAttending(rowcount)=Request.Form(NumberAttendingcount) 
	PeopleLastName(rowcount)=Request.Form(PeopleLastNamecount) 
	PeopleFirstName(rowcount)=Request.Form(PeopleFirstNamecount) 
	PeopleEmail(rowcount)=Request.Form(PeopleEmailcount) 
	PeoplePhone(rowcount)=Request.Form(PeoplePhonecount )
	PeopleCell(rowcount)=Request.Form(PeopleCellcount)
	PeopleFax(rowcount)=Request.Form(PeopleFaxcount)
	AddressStreet(rowcount)=Request.Form(AddressStreetcount)
	AddressApt(rowcount)=Request.Form(AddressAptcount)
	AddressCity(rowcount)=Request.Form(AddressCitycount)
	AddressState(rowcount)=Request.Form(AddressStatecount) 
	AddressZip(rowcount)=Request.Form(AddressZipcount)
	ClassPaidAmount(rowcount)=Request.Form(ClassPaidAmountcount)
ClassPaidAmountMonth(rowcount)=Request.Form(ClassPaidAmountMonthcount)
ClassPaidAmountDay(rowcount)=Request.Form(ClassPaidAmountDaycount)
ClassPaidAmountYear(rowcount)=Request.Form(ClassPaidAmountYearcount)
	
	
PeopleID=Request.Form("PeopleID")
Delete(rowcount)=Request.Form(Deletecount)
	
while cint(rowcount) < cint(TotalCount)	
	ClassInfoIDcount = "ClassInfoID(" & rowcount & ")"
	ClassRegIDcount = "ClassRegID(" & rowcount & ")"
	ClassPaidAmountcount = "ClassPaidAmount(" & rowcount & ")"
	ClassPaidAmountMonthcount  = "ClassPaidAmountMonth(" & rowcount & ")"
	ClassPaidAmountDaycount = "ClassPaidAmountDay(" & rowcount & ")"
	ClassPaidAmountYearcount = "ClassPaidAmountYear(" & rowcount & ")"
	ClassInfoID(rowcount)=Request.Form(ClassInfoIDcount)
	ClassRegID(rowcount)=Request.Form(ClassRegIDcount)
	ClassPaidAmount(rowcount)=Request.Form(ClassPaidAmountcount)
	ClassPaidAmountMonth(rowcount)=Request.Form(ClassPaidAmountMonthcount)
	ClassPaidAmountDay(rowcount)=Request.Form(ClassPaidAmountDaycount)
	ClassPaidAmountYear(rowcount)=Request.Form(ClassPaidAmountYearcount)
	rowcount = rowcount +1
Wend


sql2 = "select  AddressID from People where PeopleID = " & PeopleID 

	response.write("sql2= " & sql2 & "<br>")
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3

AddressID = rs2("AddressID")
response.write("addressid=" & AddressID)



 rowcount =1



str1 = PeopleFirstName(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleFirstName(rowcount)= Replace(str1, "'", "''")
End If


str1 = PeopleLastName(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleLastName(rowcount)= Replace(str1, "'", "''")
End If

'response.write("Delete=" & Delete(rowcount))

if Delete(rowcount) = "Yes" then
 	Query =  "Delete * From ClassReg where PeopleID = " & PeopleID & ";" 
 	'response.write("query=" & Query)
	Conn.Execute(Query)
	
	DeleteStudent = True
Else
	Query =  " UPDATE Address Set AddressStreet = '" & AddressStreet(rowcount) & "' ," 
    Query =  Query & "  AddressApt = '" & AddressApt(rowcount) & "', " 
    Query =  Query & "  AddressCity = '" & AddressCity(rowcount) & "', " 
    Query =  Query & "  AddressState = '" & AddressState(rowcount) & "' ," 
    Query =  Query & "  AddressZip = '" & AddressZip(rowcount) & "' " 
    Query =  Query & " where AddressID  = " & AddressID & ";" 
	Conn.Execute(Query)

	Query =  " UPDATE People Set PeopleFirstName = '" &  PeopleFirstName(rowcount) & "', " 
	Query =  Query & "  PeopleEmail = '" & PeopleEmail(rowcount) & "'," 
    Query =  Query & "  PeoplePhone = '" & PeoplePhone(rowcount) & "'," 
    Query =  Query & "  PeopleLastName = '" & PeopleLastName(rowcount) & "', " 
    Query =  Query & "  PeopleFax = '" & PeopleFax(rowcount) & "', " 
    Query =  Query & " PeopleCell = '" & PeopleCell(rowcount) & "' " 
    Query =  Query & " where PeopleID  = " & PeopleID & ";" 
	'response.write("Query=" &  Query )
	Conn.Execute(Query)


'**************************************************************************************************************
'  FIND THE Points of Interest
'**************************************************************************************************************
i=0
i=i +1

sql3 = "select * from Classinfo where EventID = " & EventID 
response.write(sql3)
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
while not rs3.eof 

	ClassOrderArray(i) =  rs3("ClassInfoID") 
	classname = "class(" & rowcount & ")" & i
	response.write("ClassOrderArray(i)111 =" & ClassOrderArray(i) & "<br>")

	
	ClassInfoIDArray(i) = request.Form(classname)
   response.write("ClassInfoIDArray(i)222 =" & ClassInfoIDArray(i) & "<br>")
 response.write("Hello!!!!!!")  
 
 
if ClassInfoIDArray(i) ="on" then
 response.write("ON")
 

 Query =  "INSERT INTO ClassReg (ClassInfoID, PeopleID, " 
 
 
if len(ClassPaidAmount(rowcount)) > 0 then
	Query =  Query & " ClassPaidAmount , " 
end if 

if len(ClassPaidAmountMonth(rowcount)) > 0 then
	Query =  Query & " ClassPaidAmountMonth , " 
end if 

if len(ClassPaidAmountDay(rowcount)) > 0 then
	Query =  Query & " ClassPaidAmountDay , " 
end if 

if len(ClassPaidAmountMonth(rowcount)) > 0 then
	Query =  Query & "  ClassPaidAmountYear , " 
end if 

Query =  Query & " NumberAttending, EventID )" 
Query =  Query & " Values ('" &  ClassOrderArray(i)  & "' ,"
Query =  Query & " " & PeopleID & " ,"

if len(ClassPaidAmount(rowcount)) > 0 then
	Query =  Query & " " & ClassPaidAmount(rowcount) & ", " 
end if 


if len(ClassPaidAmountMonth(rowcount)) > 0 then
	Query =  Query & " " & ClassPaidAmountMonth(rowcount) & ", " 
end if 

if len(ClassPaidAmountDay(rowcount)) > 0 then
	Query =  Query & " " & ClassPaidAmountDay(rowcount) & ", " 
end if 

if len(ClassPaidAmountMonth(rowcount)) > 0 then
	Query =  Query & " " & ClassPaidAmountYear(rowcount) & "," 
end if 
	Query =  Query & " " & NumberAttending(rowcount) & "," 
Query =  Query & " " & EventID & " )" 

 
response.write("<br> insert into classreg Query=" & Query & "<br>")	
Conn.Execute(Query)




else

 response.write("OFF")
sql9 = "select * from ClassReg where ClassInfoID = " & ClassOrderArray(i) & " and PeopleID = " & PeopleID
response.write(sql9)
Set rs9 = Server.CreateObject("ADODB.Recordset")
rs9.Open sql9, conn, 3, 3   
if not rs9.eof then
   CurrentClassRegID= rs9("ClassRegId")
	Query =  "Delete * From ClassReg where ClassRegID = " & CurrentClassRegID & ";" 
 	response.write("query=" & Query)
	Conn.Execute(Query)
end if
rs9.close

end if

rs3.movenext
 i=i+1 
wend
rs3.close

end if

'response.write(Query)	

	  rowcount= rowcount +1
	'Wend

End If 


if DeleteStudent = True then
 	response.redirect("StudentsEdit.asp?EventID=" & EventID & "&message=The Student was deleted.")

Else

	response.redirect("StudentsEditDetail.asp?PeopleID=" & PeopleID &  "&message=Student information updated.")
	
end if
%>
</td></tr></table>

</Body>
</HTML>