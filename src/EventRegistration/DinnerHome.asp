<html>
<head>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Registry Registration</title>
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">
</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>


<%
EventID = request.querystring("EventID")

If Request.Querystring("UpdateDinner" ) = "True" Then
	Title= Request.Form("Title") 
	ServiceTypeLookupID= Request.Form("ServiceTypeLookupID") 
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
    VegitarianOption = Request.Form("VegitarianOption")

'response.write("StopDate=" & StopDate)


str1 = Description
str2 = "'"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "''")
	
End If  


str1 = Title
str2 = "'"
If InStr(str1,str2) > 0 Then
	Title= Replace(str1,  str2, "''")
	
End If 

Query =  " UPDATE Services Set Description = '" &  Description & "',"
 if len(MaxQTY2) > 0 then
Query =  Query & " ServiceMaxQuantity  = " &  MaxQTY2  & "," 
else
Query =  Query & " ServiceMaxQuantity  = 0," 
end if

Query =  Query & " Title  = '" &  Title  & "'," 
Query =  Query & " VegitarianOption  = " &  VegitarianOption  & "," 



 if len(FeePerAnimal) > 0 then
  Query =  Query & " Price  = " &  FeePerAnimal & "," 
 else
   Query =  Query & " Price  = 0," 
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
Query =  Query & " where servicesID = " & servicesID & " and  EventID = " &  EventID & "" 

'response.write("Query = " & Query)
Conn.Execute(Query) 
end if


%>
<!--#Include file="DinnerHeader.asp"--> 
<% PageTitleText = "Dinner Overview"  %>
<!--#Include file="970Top.asp"-->

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "950" align = "center">
	<tr><td valign = "top">
<% 

sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Dinner' and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	
	ServiceTypeLookupID = rs("ServiceTypeLookupID")
	ServicesID = rs("ServicesID")
	Title = rs("Title")
	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")
	VegitarianOption = rs("VegitarianOption")

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

str1 = Title
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	Title= Replace(str1, str2 , vbCrLf)
	
End If  


str1 = Title
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	Title= Replace(str1,  str2, " ")
End If 

str1 = Title
str2 = "''"
If InStr(str1,str2) > 0 Then
	Title= Replace(str1,  str2, "'")
End If 




End If 


if FeePerAnimal = "0" then
   FeePerAnimal = ""
end if

if MaxQTY2  = "0" then
   MaxQTY2  = ""
end if



%>




<form  name=Dinnerform method="post" action="DinnerHome.asp?EventID=<%=EventID%>&UpdateDinner=True">
 <table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "950" align = "center" >
 <tbody>
 <tr>
	    <td class = "body" colspan = "2"><img src = "images/px.gif" width = "36" height = "1" alt = "Dinner Title">Dinner Title (i.e "Auction Dinner"):
		<input class="body" type="text" name = "Title" size = 70 maxsize = 90 value = "<%=Title%>">
	
		</td>
	</tr>
	<tr>
	  <td valign = "top" width = "450">
	  <table  border = "0" width = "450"  cellpadding=0 cellspacing=0 >
	  

	    <tr>
	      <td class = "body2" align = "right" width = "230">Fee per dinner ticket: </td>
	      <td class = "body2" colspan = "3"><div align = "top">$<input class="positive" type="text" name = "FeePerAnimal" size = 7 maxsize = 9 value = "<%=FeePerAnimal%>"></div>
				<input type="hidden" name="ServicesID" value = <%=ServicesID %> >
	
	<script type="text/javascript">
	
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	
	</script>

	
	      </td>
	    </tr>

	<tr>
	    <td class = "body" align = "right">Maximum # of tickets available:</td>
		<td class="body2" colspan = "3">&nbsp;
		<input class="positive" type="text" name = "MaxQTY2" size = 7 maxsize = 9 value = "<%=MaxQTY2%>">
		
			<script type="text/javascript">
	
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	
	</script>

		</td>
	</tr>
 <tr>
	    <td class = "body" align = "right">Is there a vegitarian option? :</td>
		<td class="body2" colspan = "3">&nbsp;
	
		<% if VegitarianOption = True then %>
		<small>Yes</small><input TYPE="RADIO" name="VegitarianOption" Value = "Yes" checked >
		<small>No</small><input TYPE="RADIO" name="VegitarianOption" Value = "No" >
		<% else %>
		<small>Yes</small><input TYPE="RADIO" name="VegitarianOption" Value = "Yes" >
		<small>No</small><input TYPE="RADIO" name="VegitarianOption" Value = "No" checked>
		<% end if %>

		</td>
	</tr>

	<tr >
	    <td class = "body" align = "right">Date ticket are no longer available:&nbsp;</td>
		<td class="body2" colspan = "3">
		
			<table border = "0" width = "210">
			<tr><td>
			  <select size="1" name="ServiceEndDateMonth">

		<% if len(ServiceEndDateMonth) > 0 then %>
					<option value="<%=ServiceEndDateMonth%>" selected><%=ServiceEndDateMonth%></option>
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
				</select>/
				<select size="1" name="ServiceEndDateDay">
		<% if len(ServiceEndDateDay) > 0 then %>
					<option value="<%=StartDateDay%>" selected><%=ServiceEndDateDay%></option>
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
				</select>/
		<select size="1" name="ServiceEndDateYear">
				<% if len(ServiceEndDateYear) > 0 then %>
					<option value="<%=ServiceEndDateYear%>" selected><%=ServiceEndDateYear%></option>
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
		</table>
		
		</td>
		</tr>
		<tr>
<td class = "body2" align = "right" valign = "top">
   <td class = "body" colspan = "3">
   
    
	  
	 
	  </td>
	</tr>
</table>
</td>
<td class= "body2" > 
<%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>
 <b>Dinner Description:</b>

		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1");
		</script> 

	  <textarea name="Description" cols="60" rows="6" wrap="VIRTUAL" id = "textarea1"><%= Description%></textarea> </td>
	</tr>
	<tr><td colspan = "2" class = "body2" align = "center">
	<input type="hidden" name="ServiceTypeLookupID" value = <%=ServiceTypeLookupID %> >
	<input type = "hidden"  name ="EventID"  value ="<%=EventID%>">
	<input type = "hidden"  name ="EventSubTypeID"  value ="<%=EventSubTypeID%>">
	<input type="submit"  value="Submit" class = "Regsubmit2" ><br>
	
	
	</td>
	</tr>
</table>

</form>

<!--#Include file="970Bottom.asp"-->
<!--#Include file="Footer.asp"-->
		
</Body>
</html>