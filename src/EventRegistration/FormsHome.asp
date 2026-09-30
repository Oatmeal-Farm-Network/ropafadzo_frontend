<html>
<head>
<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Registry Registration</title>

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">

 
<script type="text/javascript" src="/usableforms.js"></script>
<script language="JavaScript" src="/calendar_us.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

<script type="text/javascript">function EventTypeFormSubmit() {document.EventTypeForm.submit();}</script>
<script type="text/javascript">function EventServicesFormSubmit() {document.EventServicesForm.submit();}</script>


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >


<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 


<%
EventID = request.querystring("EventID")

If Request.Querystring("UpdateForms" ) = "True" Then
   ServicesID= Request.Form("ServicesID") 
	FeePerAnimal = Request.Form("FeePerAnimal")
	FeePerPen  = Request.Form("FeePerPen")
	MaxQTYCheckbox = Request.Form("MaxQTYCheckbox")
	MaxQTY2 = Request.Form("MaxQTY2")
	ServiceEndDateMonth = Request.Form("ServiceEndDateMonth")
	ServiceEndDateDay = Request.Form("ServiceEndDateDay")
	ServiceEndDateYear = Request.Form("ServiceEndDateYear")
	Description = Request.Form("Description")
	EventID = Request.Form("EventID")
	EventSubTypeID = Request.Form("EventSubTypeID")

'response.write("StopDate=" & StopDate)


str1 = Description
str2 = "'"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "''")
	
End If  


Query =  " UPDATE Services Set Description = '" &  Description & "',"
 if len(MaxQTY2) > 0 then
Query =  Query & " ServiceMaxQuantity  = " &  MaxQTY2  & "," 
end if
 if len(FeePerAnimal) > 0 then
  Query =  Query & " Price  = " &  FeePerAnimal & "," 
end if

 if len(ServiceEndDateMonth) > 0 then
  Query =  Query & " ServiceEndDateMonth  = " &  ServiceEndDateMonth & "," 
end if

 if len(ServiceEndDateDay) > 0 then
  Query =  Query & " ServiceEndDateDay  = " &  ServiceEndDateDay & "," 
end if

 if len(ServiceEndDateYear) > 0 then
  Query =  Query & " ServiceEndDateYear  = " &  ServiceEndDateYear & "," 
end if



 if len(FeePerPen) > 0 then
  Query =  Query & " Price2  = " &  FeePerPen & "," 
end if
 if len(StopDate1) > 0 then
 Query =  Query & " ServiceEndDate  = '" &  StopDate1 & "'," 
end if 

 Query =  Query & " Price1Discount  = 0" 
Query =  Query & " where servicesID = " & ServicesID & " and EventID = " & EventID & ";" 

'response.write("Query = " & Query)
Conn.Execute(Query) 
end if


%>
<!--#Include file="FormsHeader.asp"--> 

<table border = "0"  cellpadding=0 cellspacing=0 width = "950" align = "center" >
	<tr>
	   <td  valign = "top"   colspan = "3"><br><h2>Forms Page</h2></td>
	</tr>
	<tr><td class = "body2" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	<tr><td class = "body2" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	 <tr>
</table>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "950" align = "center">
	<tr>
	   
 <td valign = "top">  
 

<% 

sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Forms' and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	
	ServicesID = rs("ServicesID")
	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")
	EventSubTypeID = rs("EventSubTypeID")
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	MaxQTY2 =  rs("ServiceMaxQuantity")
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


%>




<form  name=Formsform method="post" action="FormsHome.asp?EventID=<%=EventID%>&UpdateForms=True">
 <table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "950" align = "center" >
 <tbody>
	<tr>
	  <td valign = "top">
</td>
<td class= "body2" > 
<%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>
 <b>Forms Show Description:</b>

		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1");
		</script> 

	  <textarea name="Description" cols="60" rows="6" wrap="VIRTUAL" id = "textarea1"><%= Description%></textarea> </td>
	</tr>
	<tr><td colspan = "2" class = "body2" align = "center">
		<input type = "text"  name ="ServicesID"  value ="<%=ServicesID%>">
	<input type = "hidden"  name ="EventID"  value ="<%=EventID%>">
	<input type = "hidden"  name ="EventSubTypeID"  value ="<%=EventSubTypeID%>">
	<input type="submit"  value="Submit" class = "Regsubmit2" ><br>
	
	
	</td>
	</tr>
</table>

</form>



		<!--#Include file="Footer.asp"-->
		
		</Body>
		</html>