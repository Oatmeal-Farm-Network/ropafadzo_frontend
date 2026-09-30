<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Edit Calendars</title>
       <Link rel="stylesheet" type="text/css" href="/administration/style.css">
</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include virtual="/Administration/Header.asp"--> 
<%
	Dim CalendarIDx(40000)
	dim CalendarDateDayx(40000)
		dim CalendarDateMonthx(40000)
			dim CalendarDateYearx(40000)
				dim CalendarDateweekdayx(40000)
	dim CalendarEndDateDayx(40000)
		dim CalendarEndDateMonthx(40000)
			dim CalendarEndDateYearx(40000)
				dim CalendarEndDateweekdayx(40000)
	dim CalendarTimex(40000)
	dim CalendarPricex(40000)
	dim CalendarTitlex(40000)
	dim CalendarDescriptionx(40000)
	dim CalendarCatIDx(40000)


	dim TotalCount
	dim rowcount

TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
'rowcount = CInt(rowcount)
rowcount = 1

while (rowcount < TotalCount)
	CalendarIDcount = "CalendarID(" & rowcount & ")"	
	CalendarDateMonthcount = "CalendarDateMonth(" & rowcount & ")"	
		CalendarDateDaycount = "CalendarDateDay(" & rowcount & ")"	
			CalendarDateYearcount = "CalendarDateYear(" & rowcount & ")"	
				CalendarDateWeekdaycount = "CalendarDateWeekday(" & rowcount & ")"	
	CalendarEndDateMonthcount = "CalendarEndDateMonth(" & rowcount & ")"	
		CalendarEndDateDaycount = "CalendarEndDateDay(" & rowcount & ")"	
			CalendarEndDateYearcount = "CalendarEndDateYear(" & rowcount & ")"	
				CalendarEndDateWeekdaycount = "CalendarEndDateWeekday(" & rowcount & ")"	
	CalendarTimecount = "CalendarTime(" & rowcount & ")"	
	CalendarPricecount = "CalendarPrice(" & rowcount & ")"	
	CalendarTitlecount = "CalendarTitle(" & rowcount & ")"	
	CalendarDescriptioncount = "CalendarDescription(" & rowcount & ")"	
	CalendarCatIDcount = "CalendarCatID(" & rowcount & ")"	
	
	CalendarIDx(rowcount)=Request.Form(CalendarIDcount) 
	CalendarDateMonthx(rowcount)=Request.Form(CalendarDateMonthcount) 
		CalendarDateDayx(rowcount)=Request.Form(CalendarDateDaycount) 
			CalendarDateYearx(rowcount)=Request.Form(CalendarDateYearcount) 
				CalendarDateWeekdayx(rowcount)=Request.Form(CalendarDateWeekdaycount) 
	CalendarEndDateMonthx(rowcount)=Request.Form(CalendarEndDateMonthcount) 
		CalendarEndDateDayx(rowcount)=Request.Form(CalendarEndDateDaycount) 
			CalendarEndDateYearx(rowcount)=Request.Form(CalendarEndDateYearcount) 
				CalendarEndDateWeekdayx(rowcount)=Request.Form(CalendarEndDateWeekdaycount) 
	CalendarTimex(rowcount)=Request.Form(CalendarTimecount) 
	CalendarPricex(rowcount)=Request.Form(CalendarPricecount) 
	CalendarTitlex(rowcount)= Request.Form(CalendarTitlecount) 
	CalendarDescriptionx(rowcount) = Request.Form(CalendarDescriptioncount) 
	CalendarCatIDx(rowcount) = Request.Form(CalendarCatIDcount) 

	rowcount = rowcount +1
Wend

 rowcount =1

while (rowcount < TotalCount)

str1 = CalendarDescriptionx(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	CalendarDescriptionx(rowcount)= Replace(str1, "'", "''")
End If

str1 = CalendarTimex(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	CalendarTimex(rowcount)(rowcount)= Replace(str1, "'", "''")
End If

str1 = CalendarPricex(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	CalendarPricex(rowcount)= Replace(str1, "'", "''")
End If

str1 = CalendarPricex(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	CalendarPricex(rowcount)= Replace(str1, "'", "''")
End If

	Query =  " UPDATE Calendar Set CalendarDateMonth = '" & CalendarDateMonthx(rowcount) & "'," 
		Query =  Query + " CalendarDateDay = '" & CalendarDateDayx(rowcount) & "'," 
			Query =  Query + " CalendarDateYear = '" & CalendarDateYearx(rowcount) & "'," 
				Query =  Query + " CalendarDateWeekday = '" & CalendarDateWeekdayx(rowcount) & "'," 
	Query =  Query + " CalendarEndDateMonth = '" & CalendarEndDateMonthx(rowcount) & "'," 
		Query =  Query + " CalendarEndDateDay = '" & CalendarEndDateDayx(rowcount) & "'," 
			Query =  Query + " CalendarEndDateYear = '" & CalendarEndDateYearx(rowcount) & "'," 
				Query =  Query + " CalendarEndDateWeekday = '" & CalendarEndDateWeekdayx(rowcount) & "'," 
	Query =  Query + " Calendartime = '" & CalendarTimex(rowcount) & "'," 
	Query =  Query + " CalendarPrice = '" & CalendarPricex(rowcount) & "'," 
	Query =  Query + " CalendarTitle = '" & CalendarTitlex(rowcount) & "'," 
	Query =  Query + " CalendarDescription = '" & CalendarDescriptionx(rowcount) & "'" 
    Query =  Query + " where CalendarID = " & CalendarIDx(rowcount) & ";" 
'response.write(Query)

Dim DataConnection, cmdDC, RecordSet
Dim RecordToEdit, Updated
Set DataConnection = Server.CreateObject("ADODB.Connection")

DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(DatabasePath)& ";" 



DataConnection.Execute(Query) 

	  rowcount= rowcount +1
	Wend

IF DataConnection.Errors.Count <> 0 then
     Call MyErrorHandler(oDBConn, sSQL)  ' pass database connection as param
 Else
 %>
<div align = "center"><H2>Your changes have successfully been made.</H2>

<%

 End If

	DataConnection.Close
	Set DataConnection = Nothing 

%>

<!--#Include file="CalendarMaintenanceInclude.asp"--> 
<!--#Include file="Footer2.asp"--> 
</Body>
</HTML>
