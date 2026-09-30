
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
	ClassInfoTitle = Request.Form("ClassInfoTitle")
	instructorsName = Request.Form("instructorsName")
	instructorsWebsite = Request.Form("instructorsWebsite")
	instructorsBio = Request.Form("instructorsBio")
	ClassInfoStudentFee = Request.Form("ClassInfoStudentFee")
	ClassDateMonth = Request.Form("ClassDateMonth")
	ClassDateDay = Request.Form("ClassDateDay")
	ClassDateYear = Request.Form("ClassDateYear")
	ClassStartTime = Request.Form("ClassStartTime")
	ClassEndTime = Request.Form("ClassEndTime")
	ClassInfoRoomDesignation = Request.Form("ClassInfoRoomDesignation")
	ClassInfoDescription = Request.Form("ClassInfoDescription")
	ClassInfoMinimumStudents = Request.Form("ClassInfoMinimumStudents")
	ClassInfoMaximumStudents = Request.Form("ClassInfoMaximumStudents")
	ClassInfoID = Request.Form("ClassInfoID")
    ClassHomework = Request.Form("ClassHomework")
		ClassInfoMaterialFee=  Request.Form("ClassInfoMaterialFee")
		ClassInfoMaterialFeeOptional=  Request.Form("ClassInfoMaterialFeeOptional")

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



		
		
str1 =ClassInfoMaterialFee
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassInfoMaterialFee= Replace(str1,  str2, "''")
	End If 
	
	
	
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
	

	str1 = ClassInfoMinimumStudents
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassInfoMinimumStudents= Replace(str1, "'", "")
	End If

	str1 = ClassInfoMaximumStudents
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassInfoMaximumStudents= Replace(str1, "'", "")
	End If


	str1 = ClassInfoTitle
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassInfoTitle= Replace(str1, "'", "''")
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
	
	str1 = ClassInfoDescription
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassInfoDescription= Replace(str1, "'", "''")
	End If
	
		str1 = ClassHomework
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ClassHomework= Replace(str1, "'", "''")
	End If


		Query =  " UPDATE ClassInfo Set ClassInfoTitle = '" &  ClassInfoTitle & "', " 
		if len(ClassInfoStudentFee)> 0 then
			Query =  Query & "  ClassInfoStudentFee = " & ClassInfoStudentFee & "," 
		end if 
		if len(ClassInfoMinimumStudents)> 0 then
    		Query =  Query & "  ClassInfoMinimumStudents = " & ClassInfoMinimumStudents & "," 
    	end if

		if len(ClassInfoMaximumStudents)> 0 then
    		Query =  Query & "  ClassInfoMaximumStudents = " & ClassInfoMaximumStudents & "," 
    	end if
    	Query =  Query & "  ClassInfoDescription = '" & ClassInfoDescription & "', " 
      	if len(ClassDateMonth)> 0 then
	    	Query =  Query & "  ClassDateMonth = " & ClassDateMonth & " ," 
		end if
		if len(ClassDateDay)> 0 then
    		Query =  Query & "  ClassDateDay = " & ClassDateDay & ", " 
    	end if
    	if len(ClassDateYear)> 0 then
    		Query =  Query & "  ClassDateYear = " & ClassDateYear & ", " 
    	end if 
   	if len(ClassInfoMaterialFee) > 0 then
	Query =  Query & " ClassInfoMaterialFee = " & ClassInfoMaterialFee & " ,"
	end if 
	Query =  Query & " ClassInfoMaterialFeeOptional = " & ClassInfoMaterialFeeOptional & " , " 
	
	Query =  Query & " instructorsName = '" & instructorsName & "' , " 
	Query =  Query & " instructorsWebsite = '" & instructorsWebsite & "' , " 
	Query =  Query & " instructorsBio = '" & instructorsBio & "' ," 
    	Query =  Query & "  ClassStartTime = '" & ClassStartTime & "' ," 
    	Query =  Query & "  ClassEndTime = '" & ClassEndTime & "' ," 
    	Query =  Query & "  ClassInfoRoomDesignation = '" & ClassInfoRoomDesignation & "' ," 
    	Query =  Query & " ClassHomework = '" & ClassHomework & "' " 
    	Query =  Query & " where ClassInfoID = " & ClassInfoID & ";" 


	response.write("Query = " & Query & "<br>")

	
	Dim cmdDC, RecordSet
	Dim RecordToEdit, Updated
	Conn.Execute(Query) 

	  rowcount= rowcount +1

%>
</td></tr></table>

<% Message = "Your Class Have Been Updated"
	Response.Redirect("ClassesEditDetails.asp?ClassInfoID=" & ClassInfoID & "&ClassName=" & ClassInfoTitle & "&Message=" & Message  ) %>

</Body>
</HTML>