<%@ Language="VBScript" %> 
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Classes /  Workshops at Andresen Events - Event Registration</title>
<meta name="Title" content="<%= EventName %> at Andresen Events - Event Registration">
<meta name="description" content="<%= EventDescription %> " >
<meta name="keywords" content="Event Registration">
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Alpacas Shows" >
<link rel="shortcut icon" href="file:///infinityknot.ico" > 
<link rel="icon" href="http://www.alpacainfinity.com/alpacachamps/infinityknot.ico" > 
<meta name="author" content="The Andresen Goup" >
<link rel="stylesheet" type="text/css" href="Style.css">
<%  PageName = "Classes" %>
<!--#Include virtual="GlobalVariablesEvent.asp"-->

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="EventHeader.asp"-->
<br />
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=DescriptionWidth%>"><tr><td class = "roundedtop" align = "left" >
		<h1><%=EventName %>  Classes/ Workshop</h1>
        </td></tr>
        <tr><td class = "roundedBottom">
<table border = "0" cellpadding=0 cellspacing=0 width = "<%=textwidth %>"  align = "center" >
	<tr>
		<td class = "body">
		<% sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Classes / Workshops' and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then %>
		<%=rs("Description") %>
<% end if %>
		</td>
	</tr>
</table>

<table border = "0"  cellpadding=0 cellspacing=0 width = "<%=bodywidth -50 %>" align = "center" >
	<tr>
	   <td  valign = "top"  >
		<br>
		<table border = "0" bordercolor = "<%=MenuBackgroundColor %>" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "<%=bodywidth -50 %>" align = "center" >
			<tr>
				<td class = "body2" colspan  "3" height = "1">
<% 
	EventID = request.querystring("EventID")
  	sql = "select * from Classinfo where EventID = " & EventID & "" 
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	
	if rs.eof then 
 	else %>
		<td class = "body2" colspan  "3" height = "1"><b> Below are a list of the scheduled classes:</b> </td>
	<% end if %>		

	</tr>
</table>

<% 



	EventID = request.querystring("EventID")
  	'response.write("EventID = " & EventID & "<br>")
  	sql = "select * from Classinfo where EventID = " & EventID & "" 
	'response.write(sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
			
		ClassInfoID = rs("ClassInfoID")
		ClassInfoTitle = rs("ClassInfoTitle")
		ClassInfoTeacherFee= rs("ClassInfoTeacherFee")
		ClassInfoMaterialFee= rs("ClassInfoMaterialFee")
		ClassInfoStudentFee= rs("ClassInfoStudentFee")
		
		'ClassInfoMaterialFee= rs("ClassInfoMaterialFee")
		'ClassInfoOrganizationFee= rs("ClassInfoOrganizationFee")
		'ClassInfoMinimumStudents= rs("ClassInfoMinimumStudents")
		ClassInfoRoomDesignation= rs("ClassInfoRoomDesignation")
		'ClassInfoAdditionalSession= rs("ClassInfoAdditionalSession")
	
	
	
	
	
	
		str1 = ClassInfoTitle
		str2 = "&nbsp;"
		If InStr(str1,str2) > 0 Then
			ClassInfoTitle= Replace(str1,  str2, " ")
		End If 
		
		str1 = ClassInfoTitle
		str2 = "''"
		If InStr(str1,str2) > 0 Then
			ClassInfoTitle= Replace(str1,  str2, "'")
		End If 
	end if 
 
	row = "odd"
	rowcount = 1
 	sql = "select * from ClassInfo  where EventID = " & EventID
	'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 

	rowcount = 1  
	if not rs.eof then %>



<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=OuterTableWidth%>" align = "center"  background = "<%=TableBackground%>">	
<tr>
  <td class = "body" align = "center" background = "<%=TableTop%>" height = "39" colspan = "6">

<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=InnerTableWidth%>" align = "center">	
<% If LayoutStyle = "Modern Landscape" or LayoutStyle = "Classic Landscape" Then 
Col1Width = "300"
Col2Width = "200"
Col3Width = "70"
Col4Width = "250"
Col5Width = "150"
else
Col1Width = "260"
Col2Width = "150"
Col3Width = "50"
Col4Width = "100"
Col5Width = "130"
end if
%>
<tr>
   <td class="menu2" align = "center" width= "<%=Col1Width %>" height = "25">
		      <b>Class Title</b>
	     </td>
	     <td class="menu2" align = "center" width = "<%=Col2Width %>">
		       <b>Instructor</b>
		 </td>
		  <td class="menu2" align = "center" width = "<%=Col3Width %>">
		       <b>Price</b>
		 </td>
		 <td class="menu2" align = "center" width = "<%=Col4Width %>">
		       <b>Date</b>
		 </td>
		 <td class="menu2" align = "center" width = "<%=Col5Width %>">
		       <b>Time</b>
		 </td>
</tr>

</table>
</td>
</tr>
<tr>
<td  >


<% 	end if %>
	
<%	
InstructorsName= ""
	While Not rs.eof
		ClassInfoTitle = rs("ClassInfoTitle")
		InstructorsName= rs("InstructorsName")
		InstructorsWebsite= rs("InstructorsWebsite")
	    InstructorsBio= rs("InstructorsBio")
	    InstructorsImage= rs("InstructorsImage")
		ClassInfoStudentFee = rs("ClassInfoStudentFee")
		ClassDateMonth = rs("ClassDateMonth")
		ClassDateDay = rs("ClassDateDay")
		ClassDateYear = rs("ClassDateYear")
		ClassInfoStudentFee= rs("ClassInfoStudentFee")
		ClassStartTime = rs("ClassStartTime")
		ClassEndTime = rs("ClassEndTime")
		ClassInfoRoomDesignation = rs("ClassInfoRoomDesignation")
		ClassInfoMaximumStudents = rs("ClassInfoMaximumStudents")
		ClassInfoMinimumStudents = rs("ClassInfoMinimumStudents")
		ClassInfoDescription = rs("ClassInfoDescription")
		ClassHomework = rs("ClassHomework")
		ClassInfoID = rs("ClassInfoID")
		
		
	if order = "even" then 
		order = "odd"
	%>
	  <tr bgcolor = "<%=StripeColor%>">
	<% else 
	   order = "even"%>
	<tr >
	<% end if %>
		<td class="body2" width = "<%=Col1Width %>" height = "25">
	    	<img src = "images/px.gif" width = "5" alt = "Event registration" /><a href = "ClassesDetails.asp?ClassInfoID=<%=ClassInfoID%>&EventID=<%=EventID%>"><%=ClassInfoTitle %></a>
	    </td>
		<td class="body2" width = "<%=Col2Width %>">
		<a href = "ClassesDetails.asp?ClassInfoID=<%=ClassInfoID%>&EventID=<%=EventID%>"><%=InstructorsName%></a>
		</td>
		<td class="body2" align = "right" width = "<%=Col3Width %>" >
		<a href = "ClassesDetails.asp?ClassInfoID=<%=ClassInfoID%>&EventID=<%=EventID%>">
		<% if len(ClassInfoStudentFee) > 0 then %>
		    <%=formatcurrency(ClassInfoStudentFee, 2 )%> </a><img src = "images/px.gif" width = "5" alt = "Event registration" />
		<% end if  %>
		</td>
		<td class="body2" align = "right" width = "<%=Col4Width %>">
			<a href = "ClassesDetails.asp?ClassInfoID=<%=ClassInfoID%>&EventID=<%=EventID%>">
			
			<% CompleteDate = True
			if ClassDateMonth > 0 and ClassDateDay > 0 and ClassDateYear > 0 then 
				   ClassDate = ClassDateMonth & "/" & ClassDateDay & "/" & ClassDateYear
				   CompleteDate = True
			     end if %>
				
			<% if CompleteDate = True and (LayoutStyle = "Modern Landscape" or LayoutStyle = "Classic Landscape" ) then %>
			    <%= FormatDateTime(ClassDate, 1)%>
			<% else %>
			    <% if ClassDateMonth > 0 then %><%=ClassDateMonth%>/<% end if %><% if ClassDateDay > 0 then %><%=ClassDateDay%>/<% end if %><%=ClassDateYear%>
			
			<% end if  %>
			</a>
		</td>
		<td class="body2" align = "left" width = "<%=Col5Width %>">
			<a href = "ClassesDetails.asp?ClassInfoID=<%=ClassInfoID%>&EventID=<%=EventID%>">
			<% if Len(ClassStartTime) > 0 then %>
				 &nbsp; <%=ClassStartTime%>-
			<% end if %>
			<% if Len(ClassEndTime) > 0 then %>
				 &nbsp; <%=ClassEndTime%>
			<% end if %>
		</td>
	  </tr>
  
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
<tr>
  <td background = <%=TableFooter%>  colspan = "6" height = "15" width = "<%=OuterTableWidth %>"><img src = "images/px.gif" height = "1" width = "1" alt = "<%= EventName %> at Andresen Events - Event Registration"></td></tr>
</table>


<% end if %>

</td></tr></TABLE>


<br><br></td></tr></TABLE>
 <!--#Include file="EventFooter.asp"--> 
</body>
</html>

