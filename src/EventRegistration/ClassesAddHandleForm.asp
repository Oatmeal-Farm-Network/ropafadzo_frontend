<HEAD>

       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

		<!--#Include virtual="Globalvariables.asp"-->


<% 
'rowcount = CInt
rowcount = 1

Action= Request.Form("Action")
EventID = Request.Form("EventID")
MissingTitle = False
If Action = "Add" Then
	ClassInfoTitle = Request.Form("ClassInfoTitle")
	if len(ClassInfoTitle) < 1 then
	    MissingTitle = True
	 end if 
	InstructorsName= Request.Form("InstructorsName")
	InstructorsWebsite= Request.Form("InstructorsWebsite")
	InstructorsBio= Request.Form("InstructorsBio")
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
ClassInfoMaterialFee=  Request.Form("ClassInfoMaterialFee")
ClassInfoMaterialFeeOptional=  Request.Form("ClassInfoMaterialFeeOptional")


str1 =ClassInfoMaterialFee
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassInfoMaterialFee= Replace(str1,  str2, "''")
	End If 
	
		
str1 =Lcase(InstructorsWebsite)
	str2 = "http://"
	If InStr(str1,str2) > 0 Then
		InstructorsWebsite= Replace(str1,  str2, "")
	End If 
	
	str1 =Lcase(InstructorsWebsite)
	str2 = "http:/"
	If InStr(str1,str2) > 0 Then
		InstructorsWebsite= Replace(str1,  str2, "")
	End If 
	
	str1 =Lcase(InstructorsWebsite)
	str2 = "http:"
	If InStr(str1,str2) > 0 Then
		InstructorsWebsite= Replace(str1,  str2, "")
	End If 
	
	str1 =Lcase(InstructorsWebsite)
	str2 = "http"
	If InStr(str1,str2) > 0 Then
		InstructorsWebsite= Replace(str1,  str2, "")
	End If 

if not   MissingTitle = True then
	
	str1 =InstructorsName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		InstructorsName= Replace(str1,  str2, "''")
	End If 
	
	str1 =InstructorsWebsite
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		InstructorsWebsite= Replace(str1,  str2, "''")
	End If 
	
		str1 =InstructorsBio
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		InstructorsBio= Replace(str1,  str2, "''")
	End If 
	
	
		str1 =ClassHomework
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassHomework= Replace(str1,  str2, "''")
	End If 
	
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

	str1 = ClassInfoStudentFee
	str2 = ","
	If InStr(str1,str2) > 0 Then
		ClassInfoStudentFee = Replace(str1, ",", "")
	End If


	if len(ClassInfoTitle) > 0 or len(InstructorID) > 0 or len(ClassInfoDescription) > 0 or len(ClassInfoStudentFee) > 0 or len(ClassHomework) > 0  or len(ClassInfoStudentFee) > 0  or len(ClassInfoDescription) > 0  or len(ClassInfoRoomDesignation) > 0 then
	'response.write("Long If statement" & "<br/>")	
	Query =  "INSERT INTO ClassInfo (ClassInfoTitle, EventID, ClassInfoDescription,"
    if len(ClassInfoMaterialFee) > 0 then
    Query =  Query &   " ClassInfoMaterialFee ,"
    end if
    
    Query =  Query &   " ClassInfoMaterialFeeOptional , " 
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
		if len(ClassInfoMinimumStudents) > 0 then
		Query =  Query &  " ClassInfoMinimumStudents ,"
	end if

	if len(ClassInfoMaximumStudents) > 0 then
		Query =  Query &  " ClassInfoMaximumStudents ,"
	end if

	Query =  Query &  " InstructorsName, InstructorsWebsite, InstructorsBio, ClassStartTime, ClassEndTime, ClassInfoRoomDesignation, ClassHomework )"
	Query =  Query & " Values ('" &  ClassInfoTitle & "' ,"
	Query =  Query & " " &  EventID & " ,"
	Query =  Query & " '" &  ClassInfoDescription & "' ,"

     if len(ClassInfoMaterialFee) > 0 then
    Query =  Query & " '" &  ClassInfoMaterialFee & "' ,"
    end if


Query =  Query & " " &  ClassInfoMaterialFeeOptional & " ,"

	
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
		if len(ClassInfoMinimumStudents) > 0 then
		Query =  Query & " " &  ClassInfoMinimumStudents & " ,"
	end if

	if len(ClassInfoMaximumStudents) > 0 then
		Query =  Query & " " &  ClassInfoMaximumStudents & " ,"
	end if
	
	Query =  Query & " '" &  InstructorsName & "' ,"
	Query =  Query & " '" &  InstructorsWebsite & "' ,"
	Query =  Query & " '" &  InstructorsBio & "' ,"
	Query =  Query & " '" &  ClassStartTime & "' ,"
	Query =  Query & " '" &  ClassEndTime & "' ,"
	Query =  Query & " '" &  ClassInfoRoomDesignation & "' ,"
	Query =  Query & " '" & ClassHomework & "' )" 

	response.write("Query= " & Query & "<br/>")	

	
	Conn.Execute(Query) 
end if
 end if 
end if


If Action = "Update" Then

	TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
rowcount = 1

dim ClassInfoTitle(10000)
dim Instructor(10000)
dim ClassInfoStudentFee(10000)
dim ClassDateMonth(10000)
dim ClassDateDay(10000)
dim ClassDateYear(10000)
dim ClassStartTime(10000)
dim ClassEndTime(10000)
dim ClassInfoRoomDesignation(10000)
dim ClassInfoMaximumStudents(10000) 
dim ClassInfoDescription(10000)
dim ClassHomework(10000)
dim ClassInfoID(10000)
dim delete(10000)



while (rowcount < TotalCount + 1)
	ClassInfoTitlecount = "ClassInfoTitle(" & rowcount & ")"	
	ClassInfoDescriptioncount = "ClassInfoDescription(" & rowcount & ")"	
	ClassInfoStudentFeecount = "ClassInfoStudentFee(" & rowcount & ")"
	ClassInfoMaximumStudentscount = "ClassInfoMaximumStudents(" & rowcount & ")"
	ClassInfoIDcount = "ClassInfoID(" & rowcount & ")"
	Instructorcount = "Instructor(" & rowcount & ")"
	ClassDateMonthcount = "ClassDateMonth(" & rowcount & ")"
	ClassDateDaycount = "ClassDateDay(" & rowcount & ")"
	ClassDateYearcount = "ClassDateYear(" & rowcount & ")"
	ClassStartTimecount = "ClassStartTime(" & rowcount & ")" 
	ClassEndTimecount = "ClassEndTime(" & rowcount & ")"
	ClassInfoRoomDesignationcount = "ClassInfoRoomDesignation(" & rowcount & ")"
	ClassHomeworkcount = "ClassHomework(" & rowcount & ")"
	Deletecount = "Delete(" & rowcount & ")"
	
	ClassInfoDescription(rowcount)=Request.Form(ClassInfoDescriptioncount) 
	ClassInfoTitle(rowcount)=Request.Form(ClassInfoTitlecount) 
	ClassInfoStudentFee(rowcount)=Request.Form(ClassInfoStudentFeecount) 
	ClassInfoMaximumStudents(rowcount)=Request.Form(ClassInfoMaximumStudentscount )
	ClassInfoID(rowcount)=Request.Form(ClassInfoIDcount)
	Instructor(rowcount)=Request.Form(Instructorcount)
	ClassDateMonth(rowcount)=Request.Form(ClassDateMonthcount)
	ClassDateDay(rowcount)=Request.Form(ClassDateDaycount)
	ClassDateYear(rowcount)=Request.Form(ClassDateYearcount)
	ClassStartTime(rowcount)=Request.Form(ClassStartTimecount) 
	ClassEndTime(rowcount)=Request.Form(ClassEndTimecount)
	ClassInfoRoomDesignation(rowcount)=Request.Form(ClassInfoRoomDesignationcount)
	ClassHomework(rowcount)=Request.Form(ClassHomeworkcount)
	Delete(rowcount)=Request.Form(Deletecount)

	
	rowcount = rowcount +1
	
Wend

 rowcount =1

while (rowcount < TotalCount + 1)

str1 = ClassInfoTitle(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	ClassInfoTitle(rowcount)= Replace(str1, "'", "''")
End If


str1 = ClassInfoDescription(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	ClassInfoDescription(rowcount)= Replace(str1, "'", "''")
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
	if len(ClassInfoMinimumStudents(rowcount))> 0 then
    Query =  Query & "  ClassInfoMaximumStudents = " & ClassInfoMinimumStudents(rowcount) & "," 
    end if
    	if len(ClassInfoMaximumStudents(rowcount))> 0 then
    Query =  Query & "  ClassInfoMaximumStudents = " & ClassInfoMaximumStudents(rowcount) & "," 
    end if

    Query =  Query & "  ClassInfoDescription = '" & ClassInfoDescription(rowcount) & "', " 
    Query =  Query & "  Instructor = '" & Instructor(rowcount) & "', " 
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

	
Dim cmdDC, RecordSet
Dim RecordToEdit, Updated
'response.write(Query)
Conn.Execute(Query) 

	  rowcount= rowcount +1
	Wend

End If 
if MissingTitle = True then
	 response.Redirect("ClassesAdd.asp?EventID=" & EventID & "&MissingTitle=True&InstructorsName=" & InstructorsName & "&InstructorsWebsite=" & InstructorsWebsite & "&InstructorsBio=" & InstructorsBio & "&ClassInfoStudentFee=" & ClassInfoStudentFee & "&ClassDateMonth=" & ClassDateMonth & "&ClassDateDay=" & ClassDateDay & "&ClassDateYear=" & ClassDateYear & "&ClassStartTime=" & ClassStartTime & "&ClassEndTime=" & ClassEndTime & "&ClassInfoRoomDesignation=" & ClassInfoRoomDesignation & "&ClassInfoMinimumStudents=" & ClassInfoMinimumStudents & "&ClassInfoMaximumStudents=" & ClassInfoMaximumStudents & "&ClassInfoDescription=" & ClassInfoDescription )
	 else
	 sql2 = "select ClassInfoID from ClassInfo  where ClassInfoTitle = '" & ClassInfoTitle & "' Order by ClassInfoID Desc"
	
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	if not rs2.eof then
        ClassInfoID = rs2("ClassInfoID")
    end if
   rs2.close
   
	 response.Redirect("ClassesAddPhotos.asp?EventID=" & EventID & "&ClassInfoID=" & ClassInfoID)
	 
end if 

%>



<!--#Include virtual="Footer.asp"-->
</Body>
</HTML>