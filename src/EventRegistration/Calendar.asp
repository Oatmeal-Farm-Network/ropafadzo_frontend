
<html >
<head>
<%  PageName = "Calendar" %>
<!--#Include file="GlobalVariables.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252"/>
<meta http-equiv="Content-Language" content="en-us"/>
<title><%= SEOTitle %> </title>
<link rel="stylesheet" href="Barnstyle.css" />
</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">


<!--#Include file="Header.asp"-->
<% Set rs = Server.CreateObject("ADODB.Recordset")
			
sql = "select * from RandomImages where Page = 'Calendar' order by rnd(RandomID)"
'response.write(sql)
rs.Open sql, conn, 3, 3
%>

<SCRIPT LANGUAGE="JavaScript">
<!--

var dimages=new Array();
var numImages=<%=rs.recordcount%>;
<%
photocounter = 0
 While not rs.eof 

PhotoID = rs("RandomImage") 
ID= rs("RandomID") 
PhotoName = rs("RandomImage") 
PhotoDescription = rs("RandomImageCaption") & "<br><br><br><br>"
Caption = rs("RandomImageCaption")

%>

dimages[<%=photocounter%>]=new Image();
  dimages[<%=photocounter%>].src="<%= PhotoName %>";
<% 
photocounter = Photocounter + 1
rs.movenext
wend %>
    
var curImage=-1;

function swapPicture()
{
 
  if (document.images)
  {
    
    var nextImage=curImage+1;
    if (nextImage>=numImages)
      nextImage=0;
    if (dimages[nextImage] && dimages[nextImage].complete)
    {
      var target=0;
      if (document.images.myImage)
        target=document.images.myImage;
      if (document.all && document.getElementById("myImage"))
        target=document.getElementById("myImage");
  
      // make sure target is valid.  It might not be valid
      //   if the page has not finished loading
      if (target)
      {
        target.src=dimages[nextImage].src;
        curImage=nextImage;
      }

      setTimeout("swapPicture()", 5000);

    }
    else
    {
      setTimeout("swapPicture()", 500);
    }
  }
}

setTimeout("swapPicture()", 5000);

//-->
</SCRIPT>								





<a name = "Top">
<table width = "600" align = "center" border = "0">
  <tr>
     <td>
   


<%

view=Request.Form("view" ) 
'response.write("view=")
'response.write(view)


If Len(State) =2 Then
  Search = "and CustState= '" & State & "'"
End If 

Order = " order by CustLastName"
If Len(Sort) > 3  Then
  Order = "  order by " & Sort & ""
End If 
'response.write(DatabasePath)

conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
						
						
sql = "select ImageCaption1 from PageLayout where PageName = 'Calendar'"
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
ImageCaption  = rs("ImageCaption1")
rs.close

 sql = "select * from Calendar"

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	rowcount = 1
	dim CalendarID(40000)
	dim CalendarTitle(40000)
	dim Calendar(40000)
	dim Calendardescription(40000)

	
Recordcount = rs.RecordCount +1
   

Dim CalendarID2(40000)
Dim CalendarImage2(40000)
Dim CalendarIDArray(1000)
Dim CalendarTitleArray(1000)
Dim CalendarArray(1000)
Dim CalendarDescriptionArray(1000)
Dim CalendarImageArray(1000)
Dim CategoryName(1000)
Dim CatNameArray(1000)
Dim CalendarPriceArray(1000)

Dim CalendarDateMonthArray(1000)
Dim CalendarDateDayArray(1000)
Dim CalendarDateYearArray(1000)
Dim	CalendarDateWeekdayArray(1000)

Dim CalendarEndDateMonthArray(1000)
Dim CalendarEndDateDayArray(1000)
Dim CalendarEndDateYearArray(1000)
Dim	CalendarEndDateWeekdayArray(1000)
Dim CalendarTimeArray(1000)
Dim Montharray(13)

%>
	


<Table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  valign = "top" width = "780" >
<tr><td class = "body"><h1><center><%=PageTitle%></center></h1>

<Table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  valign = "top" align = "right" width = "310" height = "320"><tr><td valign = "top" align = "right" class = "body"><IMG WIDTH=300 ID="myImage" NAME="myImage" SRC="/images/px.gif" valign = "top" ><br><center><%=ImageCaption%></center>		
</td></tr></table><%=PageText %><%=PageText2 %>
</td></tr>
</table>


</td>
</tr>
</table>			
				
<table width = "780" border="0" bordercolor = "blue" align = "center">
<tr><td>				



<%
		  Dim ListCalendarCatID(100,100)
		Dim ListCategoryName(100,100)


		conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" 
  Set rs = Server.CreateObject("ADODB.Recordset")
	
			 
			 sql = "select * from CalendarCategories where  len(CategoryName) > 1 and not(CategoryName='No category')  order by CategoryName  " 
			
			'response.write(sql2)

			rs.Open sql, conn, 3, 3 
			CatCounter= 0
			While Not rs.eof 
				CatCounter = CatCounter + 1
				ListCalendarCatID(CatCounter,0) = rs("CalendarCatID")
				ListCategoryName(CatCounter,0) = rs("CategoryName")
				'response.write(ListCategoryName(CatCounter,0))
				rs.movenext
			Wend
		FinalCatCounter = CatCounter

		CatCounter= 0
		SubCatCounter2 = 0
		%>
		<form action= 'Calendar.asp' method = "post">
		<b>Please select the type of event that you wish to view:</b><select  name="view">
			<option  value= "All" >All Events</option>
	<%	While CatCounter < FinalCatCounter
			CatCounter= CatCounter +1 %>
   				<option  value= "<%= ListCategoryName(CatCounter,0) %>"><%= ListCategoryName(CatCounter,0) %></option>
	<% Wend %>
    	</select>
		<input type="submit" value = "View" />&nbsp;
		   </form>




<%   i = 1
						While i <  totalmonths %>
							<a href = "#<%=montharray(i) %>" class = "body"><%=montharray(i) %> 
	Events</a> 
								<% If Not i= (totalmonths-1) Then %>
										| 
								<% End If %>
					<%	i=i+1
					 Wend %>
				
	
</td>
</tr>
<table>

<% conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
 sql = "select distinct CalendarDateMonth from Calendar order by CalendarDateMonth"

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	i = 1
	totalmonths = 0
  While Not rs.eof

	MonthInput = rs("CalendarDateMonth") %>
	<!--#Include file="ConvertMonthInclude.asp"-->
<% montharray(i) = MonthInput

		'response.write(montharray(i))
		i=i+1 
        rs.movenext
  wend
    totalmonths = i


	rs.close

		If Not view  = "All" And Len(view) > 1 then
			 
			  sql = "select * from Calendar, CalendarCategories where Calendar.CalendarCatID = CalendarCategories.CalendarCatID and CalendarCategories.CategoryName = '" & view & "' order by cint(CalendarDateYear), cint(CalendarDateMonth), cint(CalendarDateDay) "
			Else
				
			 sql = "select * from Calendar, CalendarCategories where Calendar.CalendarCatID = CalendarCategories.CalendarCatID  order by cint(CalendarDateYear), cint(CalendarDateMonth), cint(CalendarDateDay)"
			 End If 




'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	rowcount = 1
Recordcount = rs.RecordCount +1
%>


	
<% row = "odd"
If rs.eof Then %>
 <h2>We do not currently 
	have any events planned that fit that criteria. </h2>
<% Else
Dim currentmonth
Dim oldmonth
Dim Newmonth
NewMonth= False
oldmonth =  ""
 While  Not rs.eof    
currentmonth =  rs("CalendarDateMonth")


If Not(oldmonth = currentmonth) Then
   Newmonth = True
 Else
      Newmonth = False
End If 

 CalendarIDArray(rowcount) =   rs("CalendarID")     
  
	
	 CalendarTitleArray(rowcount) =   rs("CalendarTitle")
	  CalendarPriceArray(rowcount) =   rs("CalendarPrice")
	  	  CalendarDateMonthArray(rowcount) =   rs("CalendarDateMonth")
		  	  CalendarDateDayArray(rowcount) =   rs("CalendarDateDay")
			  	  CalendarDateYearArray(rowcount) =   rs("CalendarDateYear")
				  	  CalendarDateWeekdayArray(rowcount) =   rs("CalendarDateWeekday")

					    CalendarEndDateMonthArray(rowcount) =   rs("CalendarEndDateMonth")
		  	  CalendarEndDateDayArray(rowcount) =   rs("CalendarEndDateDay")
			  	  CalendarEndDateYearArray(rowcount) =   rs("CalendarEndDateYear")
				  	  CalendarEndDateWeekdayArray(rowcount) =   rs("CalendarEndDateWeekday")
		  	  CalendarTimeArray(rowcount) =   rs("CalendarTime")
	 CalendardescriptionArray(rowcount) =   rs("CalendarDescription")
	CalendarImageArray(rowcount) =   rs("CalendarImage")
	 CalendarID2(rowcount) =   rs("CalendarID")
CalendarImage2(rowcount) =   rs("CalendarImage")
CategoryName(rowcount) =   rs("CategoryName")



MonthInput = CalendarDateMonthArray(rowcount) %>
	<!--#Include file="ConvertMonthInclude.asp"-->
<% CalendarDateMonthArray(rowcount) = MonthInput 

MonthInput = CalendarEndDateMonthArray(rowcount) %>
	<!--#Include file="ConvertMonthInclude.asp"-->
<% CalendarEndDateMonthArray(rowcount) = MonthInput


	str1 = CalendardescriptionArray(rowcount)
str2 = vblf
If InStr(str1,str2) > 0 Then
	CalendardescriptionArray(rowcount)= Replace(str1, str2 , "</br>")
End If  

str1 = CalendardescriptionArray(rowcount)
str2 = vbtab
If InStr(str1,str2) > 0 Then
	CalendardescriptionArray(rowcount)= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  


%>

	
	<% If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if

 If NewMonth=true then

%>
<table border = "0" width = "720"  align = "center" bgcolor = "#F6EEE3">
			<tr>
				<td>
					<a name = "<%=CalendarDateMonthArray(rowcount)%>"></a>
					<h2><%=CalendarDateMonthArray(rowcount)%></h2>
				</td>
			</tr>
			<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>
		</table>
	<% End If %>

 
 <% If row = "even" Then %>
	<table border = "0" width = "720"  align = "center" bgcolor = "#E8CFB0">
<% Else %>
	<table border = "0" width = "720"  align = "center" bgcolor = "#F6EEE3">
<% End If %>

<%


	EndDate = False
	if Len(CalendarEndDateWeekdayArray(rowcount))> 1 Or Len(CalendarEndDateMonthArray(rowcount))>1 Or Len(CalendarEndDateDayArray(rowcount)) >1 Or Len(CalendarEndDateYearArray(rowcount))>1 Then
		EndDate = True
	 End If 



	%>		
			    <tr>
				    <td colspan = "2" class= "body">
			    
					<% If EndDate = True Then %>
							Dates:
					<% Else %>
							Date: 
					<% End If %>
					
					<%= CalendarDateWeekdayArray(rowcount)%>&nbsp; <%= CalendarDateMonthArray(rowcount)%>
					&nbsp; <%= CalendarDateDayArray(rowcount)%>, &nbsp;<%= CalendarDateYearArray(rowcount)%>&nbsp;

				<% If EndDate = True Then %>
					 - <%= CalendarEndDateWeekdayArray( rowcount)%>&nbsp; <%= CalendarEndDateMonthArray( rowcount)%>
					&nbsp; <%= CalendarEndDateDayArray( rowcount)%>, &nbsp;<%= CalendarEndDateYearArray( rowcount)%>&nbsp;
				<% End If %>

<br>
					Time: <%= CalendarTimeArray(rowcount)%>
					</td>
				</tr>
				 <tr>
				    <td colspan = "2" class= "body">Title: <b><%= CalendarTitleArray(rowcount)%></b>
					</td>
				</tr>
				 <tr>
				    <td colspan = "2" class= "body">Price: <%= CalendarPriceArray(rowcount)%>
					</td>
				</tr>
				 <tr>
				    <td colspan = "2" class= "body">Type of Event: <%= CategoryName(rowcount)%>
					</td>
				</tr>
				 
				<tr>
					<td class = "body" width = "700" colspan = "2">
					 <% If Len(CalendarImageArray(rowcount)) > 1 Then %>
							<img src = "http://www.artisanbarn.org/uploads/Calendars/<%=CalendarImageArray(rowcount)%>" width = "200" align = "right" />
						<% End If %>
						<%= CalendarDescriptionArray(rowcount)%>

						
						
					</td>
				</tr>

	

<%	oldmonth=  rs("CalendarDateMonth")
		rowcount = rowcount + 1
	   rs.movenext
	Wend
TotalCount=rowcount 
	rs.close
  set rs=nothing
  set conn = Nothing
  
  End if
%>


</table>

 <br><br>
<center><a href = "#Top" class = "body">Click here to return to the top of the 
page.</a></center>


 <!--#Include file="Footer.asp"--> 
</body>
</html>

