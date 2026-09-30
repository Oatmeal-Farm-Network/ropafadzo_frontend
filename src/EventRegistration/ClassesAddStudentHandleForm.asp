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
i=0
dim ClassOrderArray(10000) 
dim ClassInfoIDArray(10000)
   ClassesFound = False
sql = "select * from ClassInfo where EventID = " & EventID  &  ""
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

while Not rs.eof 
i=i +1
ClassInfoID = rs("ClassInfoID")


	ClassOrderArray(i) =  rs("ClassInfoID") 
	ClassInfoIDArray(i) = request.Form("class" & i )
  
if ClassInfoIDArray(i) ="on" then
   ClassesFound = True
end if


rs.movenext
wend


'rowcount = CInt
rowcount = 1



Action= Request.Form("Action")
EventID = Request.Form("EventID")

'response.write("action = " & Action  & " EventID = " & EventID )


'****************************************************************************************************
'  FIND THE Points of Interest
'****************************************************************************************************
PeopleFirstName = Request.Form("PeopleFirstName")
PeopleLastName= Request.Form("PeopleLastName")
PeopleEmail= Request.Form("PeopleEmail")
PeoplePhone= Request.Form("PeoplePhone")
PeopleCell= Request.Form("PeopleCell")
PeopleFax= Request.Form("PeopleFax")
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



If Action = "Add" and  ClassesFound = True Then
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



'response.write("ClassPaidAmount =" & ClassPaidAmount  )
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


Query =  "INSERT INTO Address (AddressStreet, AddressApt, AddressCity, AddressState, AddressZip)" 
	    Query =  Query + " Values ('" & AddressStreet  & "'," 
	    Query =  Query & " '" &  AddressApt & "', " 
		Query =  Query & " '" &  AddressCity & "', " 
		Query =  Query & " '" &  AddressState & "', " 
		Query =  Query & " '" &  AddressZip & "')" 

response.write("Query=" & Query)

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
	response.write("AddressID=" & AddressID)

	End If 
rs.close



	
Query =  "INSERT INTO People (PeopleFirstName, AddressID, PeopleLastName, PeoplePhone, PeopleCell, Peoplefax, Peopleemail ) " 
Query =  Query & " Values ('" &  PeopleFirstName & "' ,"
Query =  Query & " " &  AddressID & " ,"
Query =  Query & " '" &  PeopleLastName & "' ,"
Query =  Query & " '" &  PeoplePhone & " ',"
Query =  Query & " '" &  PeopleCell & " ',"
Query =  Query & " '" &  Peoplefax & "' ,"
Query =  Query & " '" & Peopleemail & "' )" 


	'response.write("Query=" & Query)	
	Conn.Execute(Query) 
	sql = "select PeopleID from People where AddressID = " & AddressID  & " order by PeopleID Desc;"
	
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	If Not rs.eof Then
		PeopleID = rs("PeopleID")
	End If 
rs.close


'****************************************************************************************************
'  FIND THE Points of Interest
'****************************************************************************************************
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

'response.write("Query=" & Query)	
Conn.Execute(Query) 

end if

rs3.movenext
  
end if 

 rs.movenext
wend
rs.close
 end if 
end if


If Action = "Update" Then

	TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
rowcount = 1

dim PeopleID(10000)
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
dim AddressID(10000)
dim ClassPaidAmount(10000)
dim	ClassPaidAmountMonth(10000)
dim	ClassPaidAmountDay(10000)
dim	ClassPaidAmountYear(10000)
dim NumberAttending(1000)
	
while cint(rowcount) < cint(TotalCount)
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
	ClassInfoIDcount = "ClassInfoID(" & rowcount & ")"
	ClassRegIDcount = "ClassRegID(" & rowcount & ")"
	AddressIDcount = "AddressID(" & rowcount & ")"	
	PeopleIDcount = "PeopleID(" & rowcount & ")"
	Deletecount = "Delete(" & rowcount & ")"
	ClassPaidAmountcount = "ClassPaidAmount(" & rowcount & ")"
	ClassPaidAmountMonthcount  = "ClassPaidAmountMonth(" & rowcount & ")"
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
	ClassInfoID(rowcount)=Request.Form(ClassInfoIDcount)
	ClassRegID(rowcount)=Request.Form(ClassRegIDcount)
	AddressID(rowcount)=Request.Form(AddressIDcount)
	PeopleID(rowcount)=Request.Form(PeopleIDcount)
	
	ClassPaidAmount(rowcount)=Request.Form(ClassPaidAmountcount)
	ClassPaidAmountMonth(rowcount)=Request.Form(ClassPaidAmountMonthcount)
	ClassPaidAmountDay(rowcount)=Request.Form(ClassPaidAmountDaycount)
	ClassPaidAmountYear(rowcount)=Request.Form(ClassPaidAmountYearcount)

	Delete(rowcount)=Request.Form(Deletecount)

	
	rowcount = rowcount +1
	
Wend

 rowcount =1

while cint(rowcount) < cint(TotalCount)

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
 	Query =  "Delete * From ClassReg where PeopleID = " & PeopleID(rowcount) & ";" 
 	response.write("query=" & Query)
	Conn.Execute(Query)
Else
	Query =  " UPDATE Address Set AddressStreet = '" & AddressStreet(rowcount) & "' ," 
    Query =  Query & "  AddressApt = '" & AddressApt(rowcount) & "', " 
    Query =  Query & "  AddressCity = '" & AddressCity(rowcount) & "', " 
    Query =  Query & "  AddressState = '" & AddressState(rowcount) & "' ," 
    Query =  Query & "  AddressZip = '" & AddressZip(rowcount) & "' " 
    Query =  Query & " where AddressID  = " & AddressID(rowcount) & ";" 
	Conn.Execute(Query)

	Query =  " UPDATE People Set PeopleFirstName = '" &  PeopleFirstName(rowcount) & "', " 
	Query =  Query & "  PeopleEmail = '" & PeopleEmail(rowcount) & "'," 
    Query =  Query & "  PeoplePhone = '" & PeoplePhone(rowcount) & "'," 
    Query =  Query & "  PeopleLastName = '" & PeopleLastName(rowcount) & "', " 
    Query =  Query & "  PeopleFax = '" & PeopleFax(rowcount) & "', " 
    Query =  Query & " PeopleCell = '" & PeopleCell(rowcount) & "' " 
    Query =  Query & " where PeopleID  = " & PeopleID(rowcount) & ";" 
	'response.write("Query=" &  Query )
	Conn.Execute(Query)


'****************************************************************************************************
'  FIND THE Points of Interest
'****************************************************************************************************
i=0
i=i +1

sql3 = "select * from Classinfo where EventID = " & EventID 
'response.write(sql3)
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
while not rs3.eof 

	ClassOrderArray(i) =  rs3("ClassInfoID") 
	classname = "class(" & rowcount & ")" & i
	'response.write("classname =" & classname & "<br>")

	
	ClassInfoIDArray(i) = request.Form(classname)
    'response.write("ClassOrderArray(i) =" & ClassOrderArray(i) & "<br>")
   'response.write("ClassInfoIDArray(i) =" & ClassInfoIDArray(i) & "<br>")
  
if ClassInfoIDArray(i) ="on" then
 
 
 sql9 = "select * from ClassReg where ClassInfoID = " & ClassOrderArray(i) & " and PeopleID = " & PeopleID(rowcount)
'response.write(sql9)
Set rs9 = Server.CreateObject("ADODB.Recordset")
rs9.Open sql9, conn, 3, 3   
if rs9.eof then


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
Query =  Query & " Values ('" &  ClassOrderArray(i) & "' ,"
Query =  Query & " " & PeopleID(rowcount) & " ,"


if len(ClassPaidAmountMonth) > 0 then
	Query =  Query & " " & ClassPaidAmountMonth(rowcount) & ", " 
end if 

if len(ClassPaidAmountDay) > 0 then
	Query =  Query & " " & ClassPaidAmountDay(rowcount) & ", " 
end if 

if len(ClassPaidAmountMonth) > 0 then
	Query =  Query & " " & ClassPaidAmountYear(rowcount) & "," 
end if 
	Query =  Query & " " & NumberAttending(rowcount) & "," 
Query =  Query & " " & EventID & " )" 

 
'response.write("Query=" & Query)	

else

Query =  " UPDATE  ClassReg Set ClassInfoID = " &  ClassInfoID(rowcount) & ", " 
	if len(PeopleID(rowcount)) > 0 then
		Query =  Query & "  PeopleID= " & PeopleID(rowcount) & "," 
	end if
	if len(ClassPaidAmount(rowcount)) > 0 then
		Query =  Query & "  ClassPaidAmount = " & ClassPaidAmount(rowcount) & "," 
	end if 
	if len(ClassPaidAmountMonth(rowcount)) > 0 then
    	Query =  Query & "  ClassPaidAmountMonth = " & ClassPaidAmountMonth(rowcount) & "," 
    end if
    if len(ClassPaidAmountDay(rowcount)) > 0 then
    	Query =  Query & "  ClassPaidAmountDay = " & ClassPaidAmountDay(rowcount) & "," 
    end if
    if len(ClassPaidAmountYear(rowcount)) > 0 then
    	Query =  Query & "  ClassPaidAmountYear = " & ClassPaidAmountYear(rowcount) & "," 
    end if 
    if len(NumberAttending(rowcount)) > 0 then
    	Query =  Query & "  NumberAttending = " & NumberAttending(rowcount) & ", " 
    end if
    if len(ClassRegID(rowcount)) > 0 then
   	 Query =  Query & "  EventID = " & EventID & " " 
   	end if
    Query =  Query & " where ClassRegID  = " & ClassRegID(rowcount) & ";" 
    
response.write("Query=" &  Query )
Conn.Execute(Query)

end if
rs9.close
else

 Query =  "Delete * From ClassReg where ClassRegID  = " & ClassRegID(rowcount) & ";" 

'Conn.Execute(Query) 

end if

rs3.movenext
  
wend
rs3.close

end if

'response.write(Query)	

	  rowcount= rowcount +1
	Wend

End If 


if Action = "Add" and ClassesFound = True then
   	response.redirect("StudentsAdd.asp?EventID=" & EventID & "&message=Your student has been added.")
else
    response.redirect("StudentsAdd.asp?EventID=" & EventID & "&PeopleFirstName=" & PeopleFirstName & "&PeopleLastName=" & PeopleLastName & "&PeopleEmail=" & PeopleEmail & "&PeoplePhone=" & PeoplePhone & "&PeopleCell=" & PeopleCell & "&PeopleFax=" & PeopleFax & "&AddressStreet=" & AddressStreet & "&AddressApt=" &  AddressApt & "&AddressCity=" & AddressCity & "&AddressState=" & AddressState & "&AddressCountry=" & AddressCountry & "&AddressZip=" & AddressZip & "&NumberAttending=" & NumberAttending & "&ClassPaidAmount=" & ClassPaidAmount & "&ClassPaidAmountMonth=" & ClassPaidAmountMonth & "&ClassPaidAmountDay=" & ClassPaidAmountDay & "&ClassPaidAmountYear=" & ClassPaidAmountYear & "&message=ERROR: The Student was not added because you did not select any classes. Please select at least one class, then resubmit the form.")
end if

%>
</td></tr></table>

</Body>
</HTML>