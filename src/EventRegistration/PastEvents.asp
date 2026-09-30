<% SetLocale("en-us") %>
<html>
<head> 
<%  PageName = "Past Events" %>
<!--#Include file="GlobalVariables.asp"-->
<!--#Include file="scripts.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= SEOTitle %> </title>
<META name="description" content="<%= SEODescription %> ">
<META name="keywords" content="<%= SEOKeyword1 %>, 
<%=SEOKeyword2%>, 
<%=SEOKeyword3 %>,
<%=SEOKeyword4 %>, 
<%=SEOKeyword5 %>, 
<%=SEOKeyword6 %>,  
<%=SEOKeyword7 %>, 
<%=SEOKeyword8 %>, 
<%=SEOKeyword9 %>, 
<%=SEOKeyword10 %>, 
<%=SEOKeyword11 %>, 
 <%=SEOKeyword12 %>, 
 <%=SEOKeyword13 %>, 
 <%=SEOKeyword14 %>, 
 <%=SEOKeyword15 %>, 
 <%=SEOKeyword16 %>, 
 <%=SEOKeyword17 %>, 
 <%=SEOKeyword18 %>, 
 <%=SEOKeyword19 %>, 
 <%=SEOKeyword20 %> ">


<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=style%>">


   
</HEAD>


<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<a name = "Top">
<table width = "600" align = "center">
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

 sql = "select * from Events"

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	rowcount = 1
	dim EventsID(40000)
	dim EventsTitle(40000)
	dim Events(40000)
	dim Eventsdescription(40000)
dim EventsImageCaption(40000)
	
Recordcount = rs.RecordCount +1
%>


 
<%    

Dim EventsID2(40000)
Dim EventsImage2(40000)
Dim EventsIDArray(1000)
Dim EventsTitleArray(1000)
Dim EventsArray(1000)
Dim EventsDescriptionArray(1000)
Dim EventsImageArray(1000)
Dim CategoryName(1000)
Dim CatNameArray(1000)
Dim EventsPriceArray(1000)

Dim EventsDateMonthArray(1000)
Dim 	  EventsDateDayArray(1000)
Dim 	  EventsDateYearArray(1000)
Dim	  EventsDateWeekdayArray(1000)

Dim EventsEndDateMonthArray(1000)
Dim 	  EventsEndDateDayArray(1000)
Dim 	  EventsEndDateYearArray(1000)
Dim	  EventsEndDateWeekdayArray(1000)
Dim EventsTimeArray(1000)
Dim Montharray(13)

%>
	


<Table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" valign = "top" width = "720" >
		<tr>
				<td class = "body" align ="left">
					<br><h1><%=PageTitle %></h1>
				</td>
			</tr>
		<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>
			<tr>
				<td class = "body" align ="left" >
				<%=PageText %> <br><br>



<%
		  Dim ListEventsCatID(100,100)
		Dim ListCategoryName(100,100)

  Set rs = Server.CreateObject("ADODB.Recordset")
	
			 
			 sql = "select * from EventsCategories where  len(CategoryName) > 1 and not(CategoryName='No category')  order by CategoryName  " 
			
			'response.write(sql2)

			rs.Open sql, conn, 3, 3 
			CatCounter= 0
			While Not rs.eof 
				CatCounter = CatCounter + 1
				ListEventsCatID(CatCounter,0) = rs("EventsCatID")
				ListCategoryName(CatCounter,0) = rs("CategoryName")
				'response.write(ListCategoryName(CatCounter,0))
				rs.movenext
			Wend
		FinalCatCounter = CatCounter

		CatCounter= 0
		SubCatCounter2 = 0
		%>

<%   i = 1
						While i <  totalmonths %>
							<a href = "#<%=montharray(i) %>" class = "body"><%=montharray(i) %> Events</a> 
								<% If Not i= (totalmonths-1) Then %>
										| 
								<% End If %>
					<%	i=i+1
					 Wend %>
				
			



</td>
			</tr>

<% 
sql = "select distinct EventsDateMonth from Events order by EventsDateMonth"

'response.write (sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
i = 1
totalmonths = 0
While Not rs.eof
	MonthInput = rs("EventsDateMonth") %>
	<!--#Include file="ConvertMonthInclude.asp"-->
<%  montharray(i) = MonthInput
	'response.write(montharray(i))
	i=i+1 
    rs.movenext
wend
totalmonths = i
rs.close
sql = "select * from Events  order by cint(EventsDateYear) Desc, cint(EventsDateMonth) Desc"
'response.write (sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
rowcount = 1
Recordcount = rs.RecordCount +1
%>


	
<% row = "odd"
If rs.eof Then %>

<% Else
Dim currentmonth
Dim oldmonth
Dim Newmonth
NewMonth= False
oldmonth =  ""
 While  Not rs.eof    
currentmonth =  rs("EventsDateMonth")


If Not(oldmonth = currentmonth) Then
   Newmonth = True
 Else
      Newmonth = False
End If 

 EventsIDArray(rowcount) =   rs("EventsID")     
  
'	EventsImageCaption(rowcount) = rs("EventsImageCaption")
	 EventsTitleArray(rowcount) =   rs("EventsTitle")
	  EventsPriceArray(rowcount) =   rs("EventsPrice")
	  	  EventsDateMonthArray(rowcount) =   rs("EventsDateMonth")
		  	  EventsDateDayArray(rowcount) =   rs("EventsDateDay")
			  	  EventsDateYearArray(rowcount) =   rs("EventsDateYear")
				  	  EventsDateWeekdayArray(rowcount) =   rs("EventsDateWeekday")

					    EventsEndDateMonthArray(rowcount) =   rs("EventsEndDateMonth")
		  	  EventsEndDateDayArray(rowcount) =   rs("EventsEndDateDay")
			  	  EventsEndDateYearArray(rowcount) =   rs("EventsEndDateYear")
				  	  EventsEndDateWeekdayArray(rowcount) =   rs("EventsEndDateWeekday")
		  	  EventsTimeArray(rowcount) =   rs("EventsTime")
	 EventsdescriptionArray(rowcount) =   rs("EventsDescription")
	EventsImageArray(rowcount) =   rs("EventsImage")
	 EventsID2(rowcount) =   rs("EventsID")
EventsImage2(rowcount) =   rs("EventsImage")




MonthInput = EventsDateMonthArray(rowcount) %>
	<!--#Include file="ConvertMonthInclude.asp"-->
<% EventsDateMonthArray(rowcount) = MonthInput 

MonthInput = EventsEndDateMonthArray(rowcount) %>
	<!--#Include file="ConvertMonthInclude.asp"-->
<% EventsEndDateMonthArray(rowcount) = MonthInput


	str1 = EventsdescriptionArray(rowcount)
str2 = vblf
If InStr(str1,str2) > 0 Then
	EventsdescriptionArray(rowcount)= Replace(str1, str2 , "</br>")
End If  

str1 = EventsdescriptionArray(rowcount)
str2 = vbtab
If InStr(str1,str2) > 0 Then
	EventsdescriptionArray(rowcount)= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  


%>

	
	<tr >
	<td nowrap>
	<% If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if

 
  If row = "odd" Then %>
				<tr>
					<td class = "body"><br>
						<table>
							<tr>
							<td  class = "body" valign = "top">
								<h2><%= EventsTitleArray(rowcount)%></h2>
								<%= EventsDescriptionArray( rowcount)%><br><br>
						</td>
						 <% If Len(EventsImageArray(rowcount)) > 1 Then %>
							<td align = "center" class = "body" valign = "top">
								<img src = "http://www.artisanbarn.org/uploads/Calendars/<%=EventsImageArray(rowcount)%>" width = "200" align = "center" border = "1"><br>
								<%= EventsImageCaption( rowcount)%>
							</td>
						<% End If %>
						
						</tr>
						</table>
						</td>
				</tr>
<% Else %>
				<tr>
					<td class = "body"><br>
						<table>
							<tr>
						 <% If Len(EventsImageArray(rowcount)) > 1 Then %>
							<td align = "center" class = "body" valign = "top">
								<img src = "http://www.artisanbarn.org/uploads/Calendars/<%=EventsImageArray(rowcount)%>" width = "200" align = "center" border = "1"><br>
								<%= EventsImageCaption( rowcount)%>
							</td>
						<% End If %>
						<td  class = "body" valign = "top">
								<h2><%= EventsTitleArray(rowcount)%></h2>
								<%= EventsDescriptionArray( rowcount)%><br><br>
						</td>
						</tr>
						</table>
							</td>
				</tr>
<% End If %>




					
				


<%	oldmonth=  rs("EventsDateMonth")
		rowcount = rowcount + 1
	   rs.movenext
	Wend
TotalCount=rowcount 
	rs.close
  set rs=nothing
    End if
%>


</table>
 <br><br>
<center><a href = "#Top" class = "body">Click here to return to the top of the page.</a></center>

  </td>
</tr>
</table>

 <!--#Include file="Footer.asp"--> 
</body>
</html>

