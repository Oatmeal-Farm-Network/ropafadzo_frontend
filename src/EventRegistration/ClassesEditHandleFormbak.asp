
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
Action= Request.Form("Action")
ClassInfoID = Request.Form("ClassInfoID")

If Action = "Add" Then
response.write("ADD ")
	ClassInfoTitle = Request.Form("ClassInfoTitle")
	instructorPeopleID= Request.Form("InstructorID")
	ClassInfoStudentFee = Request.Form("ClassInfoStudentFee")
	ClassDateMonth = Request.Form("ClassDateMonth")
	ClassDateDay = Request.Form("ClassDateDay")
	ClassDateYear = Request.Form("ClassDateYear")
	ClassStartTime = Request.Form("ClassStartTime")
	ClassEndTime = Request.Form("ClassEndTime")
	ClassInfoRoomDesignation = Request.Form("ClassInfoRoomDesignation")
	ClassInfoMinimumStudents = Request.Form("ClassInfoMinimumStudents")
	ClassInfoMaximumStudents = Request.Form("ClassInfoMaximumStudents")
	ClassInfoDescription = Request.Form("ClassInfoDescription")
	ClassHomework = Request.Form("ClassHomework")

	str1 =ClassInfoTitle
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassInfoTitle= Replace(str1,  str2, "''")
	End If  
	

	str1 =ClassInfoStudentFee
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassInfoStudentFee= Replace(str1,  str2, "''")
	End If 
		
	str1 =ClassStartTime
		str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassStartTime= Replace(str1,  str2, "''")
	End If 
	
	str1 =ClassEndTime
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassEndTime= Replace(str1,  str2, "''")
	End If 
	
	str1 =ClassInfoRoomDesignation
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassInfoRoomDesignation= Replace(str1,  str2, "''")
	End If 
	
	str1 =ClassInfoDescription 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassInfoDescription = Replace(str1,  str2, "''")
	End If 
	
	str1 =ClassHomework 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassHomework = Replace(str1,  str2, "''")
	End If 

	'str1 = ClassInfoStudentFee
	'str2 = ","
	'If InStr(str1,str2) > 0 Then
	'	ClassInfoStudentFee = Replace(str1, ",", "")
	'End If


	if len(ClassInfoTitle) > 0 or len(instructorPeopleID) > 0 or len(ClassInfoDescription) > 0 or len(ClassInfoStudentFee) > 0 or len(ClassHomework) > 0  or len(ClassInfoStudentFee) > 0  or len(ClassInfoDescription) > 0  or len(ClassInfoRoomDesignation) > 0 then
	'response.write("Long If statement" & "<br/>")	
	Query =  "INSERT INTO ClassInfo (ClassInfoTitle, EventID, instructorPeopleID, ClassInfoDescription,  " 
	if len(ClassInfoStudentFee) > 0 then
		Query =  Query &   " ClassInfoStudentFee ,"
	end if
	if len(ClassDateMonth) > 0 then
		Query =  Query &  " ClassDateMonth ,"
	end if
	if len(ClassDateDay) > 0 then
		Query =  Query &  " ClassDateDay ,"
	end if
	if len(ClassDateYear) > 0 then
		Query =  Query &  " ClassDateYear ,"
	end if
	if len(ClassInfoMaximumStudents) > 0 then
		Query =  Query &  " ClassInfoMaximumStudents ,"
	end if

	Query =  Query &  " ClassStartTime, ClassEndTime, ClassInfoRoomDesignation, ClassHomework )"
	Query =  Query & " Values ('" &  ClassInfoTitle & "' ,"
	Query =  Query & " " &  EventID & " ,"
	Query =  Query & " '" &  instructorPeopleID & " ',"
	Query =  Query & " '" &  ClassInfoDescription & "' ,"

	if len(ClassInfoStudentFee) > 0 then
		Query =  Query & " " &  ClassInfoStudentFee & " ,"
	end if
	if len(ClassDateMonth) > 0 then
		Query =  Query & " " &  ClassDateMonth & " ,"
	end if
	if len(ClassDateDay) > 0 then
		Query =  Query & " " &  ClassDateDay & " ,"
	end if
	if len(ClassDateYear) > 0 then
		Query =  Query & " " &  ClassDateYear & " ,"
	end if
	if len(ClassInfoMaximumStudents) > 0 then
		Query =  Query & " " &  ClassInfoMaximumStudents & " ,"
	end if

	Query =  Query & " '" &  ClassStartTime & "' ,"
	Query =  Query & " '" &  ClassEndTime & "' ,"
	Query =  Query & " '" &  ClassInfoRoomDesignation & "' ,"
	Query =  Query & " '" & ClassHomework & "' )" 

	'response.write("Query= " & Query & "<br/>")	

	
	Conn.Execute(Query) 
	Message = "Your Class Has Been Added"
 end if 
end if


If Action = "Update" Then

	TotalCount= Request.Form("TotalCount")
	TotalCount = CInt(TotalCount)

dim ClassInfoTitle(10000)
dim instructorPeopleID(10000)
dim ClassInfoStudentFee(10000)
dim ClassDateMonth(10000)
dim ClassDateDay(10000)
dim ClassDateYear(10000)
dim ClassStartTime(10000)
dim ClassEndTime(10000)
dim ClassInfoRoomDesignation(10000)
dim ClassInfoMinimumStudents(10000) 
dim ClassInfoMaximumStudents(10000) 
dim ClassInfoDescription(10000)
dim ClassHomework(10000)
dim ClassInfoID(10000)
dim delete(10000)

while (rowcount < TotalCount + 1)
	ClassInfoTitlecount = "ClassInfoTitle(" & rowcount & ")"
	instructorPeopleIDcount = "InstructorID(" & rowcount & ")"
	ClassInfoStudentFeecount = "ClassInfoStudentFee(" & rowcount & ")"
	ClassDateMonthcount = "ClassDateMonth(" & rowcount & ")"
	ClassDateDaycount = "ClassDateDay(" & rowcount & ")"
	ClassDateYearcount = "ClassDateYear(" & rowcount & ")"
	ClassStartTimecount = "ClassStartTime(" & rowcount & ")"
	ClassEndTimecount = "ClassEndTime(" & rowcount & ")"
	ClassInfoRoomDesignationcount = "ClassInfoRoomDesignation(" & rowcount & ")"
	ClassInfoDescriptioncount = "ClassInfoDescription(" & rowcount & ")"	
	ClassInfoMinimumStudentscount = "ClassInfoMinimumStudents(" & rowcount & ")"
	ClassInfoMaximumStudentscount = "ClassInfoMaximumStudents(" & rowcount & ")"
	ClassInfoIDcount = "ClassInfoID(" & rowcount & ")"
    ClassHomeworkcount = "ClassHomework(" & rowcount & ")"
	Deletecount = "Delete(" & rowcount & ")"
	
	ClassInfoTitle(rowcount)=Request.Form(ClassInfoTitlecount)
	instructorPeopleID(rowcount)=Request.Form(instructorPeopleIDcount) 
	ClassInfoStudentFee(rowcount)=Request.Form(ClassInfoStudentFeecount)
	ClassDateMonth(rowcount)=Request.Form(ClassDateMonthcount)
	ClassDateDay(rowcount)=Request.Form(ClassDateDaycount)
	ClassDateYear(rowcount)=Request.Form(ClassDateYearcount)
	ClassStartTime(rowcount)=Request.Form(ClassStartTimecount) 
	ClassEndTime(rowcount)=Request.Form(ClassEndTimecount)
	ClassInfoRoomDesignation(rowcount)=Request.Form(ClassInfoRoomDesignationcount)
	ClassInfoMinimumStudents(rowcount)=Request.form(ClassInfoMinimumStudentscount)
	ClassInfoMaximumStudents(rowcount)=Request.Form(ClassInfoMaximumStudentscount)
	ClassInfoID(rowcount)=Request.Form(ClassInfoIDcount)
	ClassHomework(rowcount)=Request.Form(ClassHomeworkcount)
	ClassInfoDescription(rowcount)=Request.Form(ClassInfoDescriptioncount) 
	Delete(rowcount)=Request.Form(Deletecount)

	
	rowcount = rowcount +1
	
Wend

rowcount=1

while (rowcount < TotalCount + 1)

	str1 = ClassInfoTitle(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassInfoTitle(rowcount)= Replace(str1, "'", "''")
	End If

	
	str1 =ClassStartTime(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassStartTime(rowcount)= Replace(str1,  str2, "''")
	End If 
	
	str1 =ClassEndTime(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassEndTime(rowcount)= Replace(str1,  str2, "''")
	End If 
	
	str1 =ClassInfoRoomDesignation(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassInfoRoomDesignation(rowcount)= Replace(str1,  str2, "''")
	End If 
	
	str1 = ClassInfoDescription(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassInfoDescription(rowcount)= Replace(str1, "'", "''")
	End If
	
		str1 = ClassHomework(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassHomework(rowcount)= Replace(str1, "'", "''")
	End If




	'response.write("Delete(" & rowcount & )=" & Delete(rowcount))
	if Delete(rowcount) = "Yes" then
 		Query =  "Delete * From ClassInfo where ClassInfoID = " & ClassInfoID(rowcount) & ";" 
		Message = "Your Class Has Been Deleted"
	Else
		Query =  " UPDATE ClassInfo Set ClassInfoTitle = '" &  ClassInfoTitle(rowcount) & "', " 
		if len(ClassInfoStudentFee(rowcount))> 0 then
			Query =  Query & "  ClassInfoStudentFee = " & ClassInfoStudentFee(rowcount) & "," 
		end if 
		if len(ClassInfoMaximumStudents(rowcount))> 0 then
    		Query =  Query & "  ClassInfoMaximumStudents = " & ClassInfoMaximumStudents(rowcount) & "," 
    	end if
    	Query =  Query & "  ClassInfoDescription = '" & ClassInfoDescription(rowcount) & "', " 
    	Query =  Query & "  instructorPeopleID = " & instructorPeopleID(rowcount) & ", " 
    	if len(ClassDateMonth(rowcount))> 0 then
	    	Query =  Query & "  ClassDateMonth = " & ClassDateMonth(rowcount) & " ," 
		end if
		if len(ClassDateDay(rowcount))> 0 then
    		Query =  Query & "  ClassDateDay = " & ClassDateDay(rowcount) & ", " 
    	end if
    	if len(ClassDateYear(rowcount))> 0 then
    		Query =  Query & "  ClassDateYear = " & ClassDateYear(rowcount) & ", " 
    	end if 
    	Query =  Query & "  ClassStartTime = '" & ClassStartTime(rowcount) & "' ," 
    	Query =  Query & "  ClassEndTime = '" & ClassEndTime(rowcount) & "' ," 
    	Query =  Query & "  ClassInfoRoomDesignation = '" & ClassInfoRoomDesignation(rowcount) & "' ," 
    	Query =  Query & " ClassHomework = '" & ClassHomework(rowcount) & "' " 
    	Query =  Query & " where ClassInfoID = " & ClassInfoID(rowcount) & ";" 

	end if
	response.write("Query = " & Query & "<br>")

	
	Dim cmdDC, RecordSet
	Dim RecordToEdit, Updated
	Conn.Execute(Query) 

	  rowcount= rowcount +1
Wend

End If 

	If len(Message) > 1 then
		Message = Message & " and Your Classes Have Been Updated"
	else
		Message = "Your Class Has Been Added."
	end if 
%>
</td></tr></table>

<% Message = "Your Classes Have Been Updated"
	Response.Redirect("ClassesEditDetails.asp?ClassInfoID=28&ClassName=eating cakeEventID=" & EventID & "&Message=" & Message  ) %>

</Body>
</HTML>