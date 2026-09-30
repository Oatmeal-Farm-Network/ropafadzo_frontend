<html>
<head>


<!--#Include virtual="GlobalVariables.asp"-->


<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Set Up Classes</title>
<meta name="author" content="AndresenEvents.com">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="AndresenEvents.com">
<link rel="stylesheet" type="text/css" href="Style.css">

</head>
<body>

<!--#Include file="Header.asp"-->

<!--#Include file="ClassesHeader.asp"-->
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

<% 
dim ClassInfoTitlearray(1000)
dim ClassInfoMaximumStudentsarray(1000)

x = 0

sql = "select * from Services where ServiceTypeLookupID = 5 and  EventID =  " & EventID & ""
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if rs.eof then
    rs.close
	Query =  "INSERT INTO Services (EventID, ServiceTypeLookupID)" 
	Query =  Query & " Values (" &  EventID & ", "
	Query =  Query &  " 5 )" 
	'response.write(" Query=" &  Query)
	Conn.Execute(Query) 
	
sql = "select * from Services where ServiceTypeLookupID = 5 and  EventID =  " & EventID & ""

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

end if

	ServiceEndDateMonth = rs("ServiceEndDateMonth")
	ServiceEndDateDay = rs("ServiceEndDateDay")
	ServiceEndDateYear = rs("ServiceEndDateYear")
	Description = rs("Description")
	MaxDate = rs("MaxDate")
	servicesID = rs("servicesID")
	
	StopDate = ""

	'response.write("servicesID =" & servicesID )
	if MaxDate = "True" then
	  StopDate = "Checked"
	End If 



If Request.Querystring("UpdateClasses" ) = "True" Then

	
	ServiceEndDateMonth= Request.Form("ServiceEndDateMonth")
	ServiceEndDateDay = Request.Form("ServiceEndDateDay")
	StopDateYear = Request.Form("StopDateYear")
	Description = Request.Form("Description")
	EventID = Request.Form("EventID")
	MaxDate = Request.Form("MaxDate")
	ServiceTypeLookupID = Request.Form("ServiceTypeLookupID")
	'servicesID = Request.Form("servicesID")
		
		
	str1 = Description
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		Description= Replace(str1,  str2, "''")
	End If  



Query =  " UPDATE Services Set "
 if len(ServiceEndDateMonth) > 0 then
Query =  Query & " ServiceEndDateMonth  = " &  ServiceEndDateMonth  & "," 
end if
 if len(ServiceEndDateDay) > 0 then
  Query =  Query & " ServiceEndDateDay  = " &  ServiceEndDateDay & "," 
end if
 if len(ServiceEndDateYear) > 0 then
  Query =  Query & " ServiceEndDateYear  = " &  ServiceEndDateYear & "," 
end if

if len(MaxDate) > 0 then
	Query =  Query & " MaxDate = " &  MaxDate & ","
end if
Query =  Query & " Description = '" &  Description & "'"
Query =  Query & " where servicesID = " & servicesID & ";" 
'response.write("Query = " & Query)
Conn.Execute(Query) 

end if

sql = "select * from ClassInfo where EventID =  " & EventID & ""
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	NumberofClasses = rs.recordcount
End If 


%>


 <table border = "0"   cellpadding=0 cellspacing=0 width = "900" align = "center" >
 <tbody>
	<tr>
	   <td  valign = "top" align = "center"  bgcolor = "#DBF5F3" colspan = "3"><h2>Classes</h2></td>
	</tr>
	<tr>
	  <td background = "images/underline.gif" width = "450">
	  	<h2><center>Facts</center></h2>
	  </td>
	   <td background = "images/underline.gif" width = "450">
	  	<h2><center>Stats</center></h2>
	  </td>
 </tr>
	  <tr>
	  <td valign = "top">
<form  name=Classesform method="post" action="ClassesSetup.asp?EventID=<%=EventID%>&UpdateClasses=True">
<input type="hidden" name="servicesID" value = "<%=servicesID%>" >
 <table cellpadding = "0" cellspacing="0" border = "0" width = "100%">
 	<tr>
		<td class = "body2" colspan = "2" ><input type="checkbox" name="MaxDate" id="cMaxDate" rel="cMaxDate" <%=StopDate%> > Class registration should end on a certain date. </td>
	</tr>
 
	<tr rel="cMaxDate">
	    <td>&nbsp;</td>
		<td class="body2" ><label for="cMaxDate"><span class="accessibility"></span>
		<table>
		
	   <tr>
		<td class = "body2" align = "right">
			End Date: &nbsp;</td>
		<td>
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
				</select>
				<select size="1" name="ServiceEndDateDay">
		<% if len(ServiceEndDateDay) > 0 then %>
					<option value="<%=ServiceEndDateDay%>" selected><%=ServiceEndDateDay%></option>
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
				</select>
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
			
		
		</label>
		
		</td>
	</tr>
<tr>
<td class = "body2"  valign = "top" colspan = "2"><br>Overall Classess Registration Description:</td>
</tr>
<tr>
   <td class = "body" colspan = "2">
	  <textarea name="Description" cols="50" rows="9" wrap="VIRTUAL" ><%= Description%></textarea>  
	  
	 
	  </td>
	</tr>
	<tr>
	<td align = "center" colspan = "4">
	<input type = "hidden"  name ="EventID"  value ="<%=EventID%>">
	<input type = "hidden"  name ="EventSubTypeID"  value ="<%=EventSubTypeID%>">
	<input type="submit"  value="Update"  ><br>
    	</td>
	</tr>
</table>

</form>

</td>
<td valign = "top">
  <% if NumberofClasses > 0 then %>
 <table cellpadding = "0" cellspacing="0" border = "0" width = "450">
 	     <tr>
	      <td class = "body2" align = "center"><b>Class Name</b></td>
	      <td class = "body2" align = "center"><b># Registered</b></td>
	     </tr>
	    <% sql = "select * from  ClassInfo where EventID =  " & EventID & " Order by ClassInfoID Asc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	while not rs.eof
	 x = x + 1
	    ClassInfoTitle = rs("ClassInfoTitle")
		ClassInfoID = rs("ClassInfoID") %>
	
	<tr>
	 <td class = "body2" align = "right"><%= ClassInfoTitle %></td>
	<td class = "body2" align = "center" width = "90" >
	<%sql2 = "select * from  Classreg where ClassInfoID  = " & ClassInfoID & " Order by ClassInfoID Asc"
	'response.write(sql2)
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3   
	If Not rs2.eof Then %>

		<%= rs2.recordcount %>
	<% else %>
		0
	<% end if%>
	</td></tr>
	
	
<%	rs.movenext
	wend
End If %>
   
	     
	     
	    </table>
	    
	    
	    <%end if %>
	  </td>
	  
	  
	  
	  </tr>
	  </table>


<!--#Include virtual="Footer.asp"-->

</Body>
</HTML>